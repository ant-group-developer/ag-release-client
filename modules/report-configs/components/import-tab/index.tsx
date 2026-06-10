import { useState } from 'react';
import { Button, Modal, Form, Checkbox, Upload, theme } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePreValidateImport } from '../../hooks/use-pre-validate-import';
import { PreValidateImportFile } from '../../types/payload';
import { showNotification } from '@/helpers/messages-helper';

export default function ImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { profile } = useAuth();
    const [form] = Form.useForm();
    const { preValidateImport, isPending } = usePreValidateImport();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationResult, setValidationResult] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const tenantId = profile?.tenantId || '';

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationResult(null);
        setIsUploading(false);
        form.resetFields();
    };

    const handleSubmit = (values: any) => {
        const { allowedExtensions, files } = values;

        // Map UploadFile[] to PreValidateImportFile[]
        const mappedFiles: PreValidateImportFile[] = (files || []).map(
            (file: any) => {
                const originalFile = file.originFileObj as File;
                const path = originalFile?.webkitRelativePath || file.name || '';
                const size = file.size || originalFile?.size || 0;
                return {
                    path,
                    size,
                };
            }
        );

        const payload = {
            files: mappedFiles,
            tenantId,
            allowedExtensions,
        };

        preValidateImport({
            payload,
            onSuccess: async (res: any) => {
                const data = res?.data;
                setValidationResult(data);

                const matched = data?.matched || [];
                if (matched.length > 0) {
                    setIsUploading(true);
                    try {
                        const uploadPromises = matched.map(async (matchedItem: any) => {
                            const file = files.find((f: any) => {
                                const originalFile = f.originFileObj as File;
                                const path = originalFile?.webkitRelativePath || f.name || '';
                                return path === matchedItem.path;
                            });

                            if (file && file.originFileObj) {
                                const response = await fetch(matchedItem.uploadUrl, {
                                    method: 'PUT',
                                    body: file.originFileObj,
                                });
                                if (!response.ok) {
                                    throw new Error(`Failed to upload ${matchedItem.path}`);
                                }
                            } else {
                                throw new Error(`File not found in local files: ${matchedItem.path}`);
                            }
                        });

                        await Promise.all(uploadPromises);
                        showNotification(
                            'success',
                            messages('message.createSuccessfully') || 'Upload successfully!'
                        );
                    } catch (error: any) {
                        showNotification(
                            'error',
                            error?.message || 'Failed to upload files.'
                        );
                    } finally {
                        setIsUploading(false);
                    }
                }
            },
        });
    };

    return (
        <div style={{ padding: '24px 0' }}>
            {/* Container Card */}
            <div
                style={{
                    maxWidth: 640,
                    margin: '48px auto',
                    padding: '48px 32px',
                    textAlign: 'center',
                    backgroundColor: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG * 1.5,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimaryBgHover} 100%)`,
                        color: token.colorPrimary,
                        fontSize: 40,
                        marginBottom: 24,
                    }}
                >
                    <CloudUploadOutlined />
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 600, color: token.colorText }}>
                    {messages('reportConfigs.importReport')}
                </h2>
                
                <p
                    style={{
                        fontSize: 14,
                        color: token.colorTextDescription,
                        maxWidth: 420,
                        margin: '12px auto 32px',
                        lineHeight: '1.6',
                    }}
                >
                    {messages('reportConfigs.dragDropHint')}
                </p>

                <Button
                    type="primary"
                    size="large"
                    icon={<CloudUploadOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '0 32px',
                        height: 48,
                        borderRadius: 24,
                        fontWeight: 600,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    {messages('reportConfigs.importReportBtn')}
                </Button>
            </div>

            {/* Import Modal */}
            <Modal
                title={messages('reportConfigs.importModalTitle')}
                open={isModalOpen}
                confirmLoading={isPending || isUploading}
                onOk={() => {
                    if (validationResult) {
                        handleCloseModal();
                    } else {
                        form.submit();
                    }
                }}
                onCancel={handleCloseModal}
                okText={messages('common.submit')}
                cancelText={messages('common.cancel')}
                destroyOnClose
                width={560}
                closable={!isUploading}
                maskClosable={!isUploading}
                footer={
                    validationResult
                        ? [
                              <Button
                                  key="close"
                                  type="primary"
                                  loading={isUploading}
                                  onClick={handleCloseModal}
                              >
                                  {messages('common.cancel') || 'Đóng'}
                              </Button>,
                          ]
                        : undefined
                }
            >
                {validationResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                        {/* Matched Files / Upload Status */}
                        {validationResult.matched?.length > 0 && (
                            <div
                                style={{
                                    padding: 16,
                                    borderRadius: token.borderRadiusLG,
                                    backgroundColor: isUploading ? token.colorInfoBg : token.colorSuccessBg,
                                    border: `1px solid ${isUploading ? token.colorInfoBorder : token.colorSuccessBorder}`,
                                }}
                            >
                                <div style={{ fontWeight: 600, color: isUploading ? token.colorInfoText : token.colorSuccessText }}>
                                    {isUploading 
                                        ? `Đang tải lên ${validationResult.matched.length} tệp tin hợp lệ...` 
                                        : `Đã tải lên thành công ${validationResult.matched.length} tệp tin hợp lệ!`}
                                </div>
                            </div>
                        )}

                        {/* Invalid Files List */}
                        {validationResult.invalid?.length > 0 && (
                            <div>
                                <h4 style={{ color: token.colorError, marginBottom: 8, fontWeight: 600 }}>
                                    Tệp tin không hợp lệ ({validationResult.invalid.length}):
                                </h4>
                                <div 
                                    style={{ 
                                        maxHeight: 240, 
                                        overflowY: 'auto', 
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        borderRadius: token.borderRadiusLG,
                                        padding: '8px 16px',
                                        backgroundColor: token.colorBgLayout,
                                    }}
                                >
                                    {validationResult.invalid.map((item: any, idx: number) => (
                                        <div 
                                            key={idx} 
                                            style={{ 
                                                padding: '8px 0', 
                                                borderBottom: idx < validationResult.invalid.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            <span style={{ fontWeight: 500, fontSize: 13, color: token.colorText }}>
                                                {item.path}
                                            </span>
                                            <span style={{ fontSize: 12, color: token.colorError }}>
                                                {item.reason}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            allowedExtensions: ['csv', 'txt'],
                        }}
                        style={{ marginTop: 24 }}
                    >
                        {/* Format Selection */}
                        <Form.Item
                            name="allowedExtensions"
                            label={messages('reportConfigs.allowedExtensions')}
                            rules={[
                                {
                                    required: true,
                                    message: messages(
                                        'reportConfigs.validation.requiredExtensions'
                                    ),
                                },
                            ]}
                        >
                            <Checkbox.Group
                                options={[
                                    { label: 'CSV', value: 'csv' },
                                    { label: 'TXT', value: 'txt' },
                                ]}
                            />
                        </Form.Item>

                        {/* File Upload Area */}
                        <Form.Item
                            label={messages('reportConfigs.selectFiles')}
                            required
                        >
                            <Form.Item
                                name="files"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[
                                    {
                                        required: true,
                                        message: messages(
                                            'reportConfigs.validation.requiredFiles'
                                        ),
                                    },
                                ]}
                                noStyle
                            >
                                <Upload.Dragger
                                    multiple
                                    beforeUpload={() => false}
                                    showUploadList={{
                                        showRemoveIcon: true,
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        {messages('reportConfigs.dragDropHint')}
                                    </p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
}
