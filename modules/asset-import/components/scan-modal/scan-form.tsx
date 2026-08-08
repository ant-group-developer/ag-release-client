import TenantSelect from '@/components/ui/select/tenant-select';
import { InboxOutlined } from '@ant-design/icons';
import { Checkbox, Form, FormInstance, Progress, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ScanFormProps {
    form: FormInstance;
    onSubmit: (values: any) => void;
    isUploading?: boolean;
    uploadPercent?: number;
}

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export const ScanForm: React.FC<ScanFormProps> = ({
    form,
    onSubmit,
    isUploading,
    uploadPercent = 0,
}) => {
    const messages = useTranslations();

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            disabled={isUploading}
            style={{ marginTop: 24 }}
        >
            <Form.Item
                name="targetTenantId"
                label={messages('assetImport.scan.targetTenant')}
                rules={[
                    { required: true, message: messages('validation.input') },
                ]}
            >
                <TenantSelect placeholder={messages('tenant.selectTitle')} />
            </Form.Item>

            <Form.Item label={messages('assetImport.scan.file')} required>
                <Form.Item
                    name="file"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.file'),
                        },
                    ]}
                    noStyle
                >
                    <Upload.Dragger
                        maxCount={1}
                        beforeUpload={() => false}
                        accept=".csv,.xlsx"
                        showUploadList={{ showRemoveIcon: !isUploading }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            {messages('assetImport.scan.dragDropHint')}
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>

            {isUploading && (
                <Form.Item>
                    <Progress percent={uploadPercent} />
                </Form.Item>
            )}

            <Form.Item label={messages('assetImport.scan.options')}>
                <Form.Item
                    name="updateOwnership"
                    valuePropName="checked"
                    noStyle
                >
                    <Checkbox>
                        {messages('assetImport.scan.updateOwnership')}
                    </Checkbox>
                </Form.Item>
                <br />
                <Form.Item
                    name="overwriteMetadata"
                    valuePropName="checked"
                    noStyle
                >
                    <Checkbox>
                        {messages('assetImport.scan.overwriteMetadata')}
                    </Checkbox>
                </Form.Item>
                <br />
                <Form.Item
                    name="createIfNotFound"
                    valuePropName="checked"
                    noStyle
                >
                    <Checkbox>
                        {messages('assetImport.scan.createIfNotFound')}
                    </Checkbox>
                </Form.Item>
                <br />
                <Form.Item
                    name="fillEmptyOnly"
                    valuePropName="checked"
                    noStyle
                >
                    <Checkbox>
                        {messages('assetImport.scan.fillEmptyOnly')}
                    </Checkbox>
                </Form.Item>
                <br />
                <Form.Item
                    name="createLabelIfMissing"
                    valuePropName="checked"
                    noStyle
                >
                    <Checkbox>
                        {messages('assetImport.scan.createLabelIfMissing')}
                    </Checkbox>
                </Form.Item>
            </Form.Item>
        </Form>
    );
};
