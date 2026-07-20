import { Form, Input, Modal, Select, Switch, message } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetFtpParserConfigDetail } from '../../hooks/use-get-ftp-parser-config-detail';
import { useUpdateFtpParserConfig } from '../../hooks/use-update-ftp-parser-config';
import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';

interface FtpParserConfigModalProps {
    open: boolean;
    onCancel: () => void;
    dspReportId: string;
    category: string;
}

interface FormValues {
    isActive: boolean;
    description: string;
    includePatterns: string;
    excludePatterns: string;
}

export const FtpParserConfigModal = ({
    open,
    onCancel,
    dspReportId,
    category,
}: FtpParserConfigModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm<FormValues>();
    const { ftpParserConfigDetail, isLoading } = useGetFtpParserConfigDetail(
        dspReportId,
        category
    );
    const { updateFtpParserConfig, isPending } = useUpdateFtpParserConfig();

    useEffect(() => {
        if (ftpParserConfigDetail) {
            form.setFieldsValue({
                isActive: ftpParserConfigDetail.isActive,
                description: ftpParserConfigDetail.description,
                includePatterns: (ftpParserConfigDetail.includePatterns || []).join(', '),
                excludePatterns: (ftpParserConfigDetail.excludePatterns || []).join(', '),
            });
        }
    }, [ftpParserConfigDetail, form]);

    const onFinish = (values: FormValues) => {
        const includePatterns = values.includePatterns
            ? values.includePatterns
                  .split(',')
                  .map((item) => item.trim())
                  .filter((item) => item !== '')
            : [];
        const excludePatterns = values.excludePatterns
            ? values.excludePatterns
                  .split(',')
                  .map((item) => item.trim())
                  .filter((item) => item !== '')
            : [];

        updateFtpParserConfig({
            id: dspReportId,
            category,
            payload: {
                isActive: values.isActive,
                description: values.description,
                includePatterns,
                excludePatterns,
                parserCode: ftpParserConfigDetail?.parserCode,
            },
            onSuccess: () => {
                message.success(messages('dspReport.ftpParserConfig.success'));
                onCancel();
            },
            onError: () => {
                message.error(messages('dspReport.ftpParserConfig.failed'));
            },
        });
    };

    return (
        <Modal
            title={messages('dspReport.ftpParserConfig.title', { category })}
            open={open}
            onCancel={onCancel}
            onOk={form.submit}
            confirmLoading={isPending}
            loading={isLoading}
            destroyOnClose
            centered
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
                disabled={isPending}
            >
                <AppFormItem
                    name="isActive"
                    label={messages('dspReport.ftpParserConfig.status')}
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('dspReport.ftpParserConfig.description')}
                    rules={[
                        {
                            max: 500,
                            message: messages('validation.stringMax', {
                                field: messages('dspReport.ftpParserConfig.description'),
                                max: 500,
                            }),
                        },
                    ]}
                >
                    <Input.TextArea placeholder={messages('dspReport.ftpParserConfig.description')} rows={3} allowClear />
                </AppFormItem>

                <AppFormItem
                    name="includePatterns"
                    label={messages('dspReport.ftpParserConfig.includePatterns')}
                >
                    <Input.TextArea
                        placeholder="Nhập các mẫu, phân cách bằng dấu phẩy (vd: pattern1, pattern2)"
                        rows={2}
                        allowClear
                    />
                </AppFormItem>

                <AppFormItem
                    name="excludePatterns"
                    label={messages('dspReport.ftpParserConfig.excludePatterns')}
                >
                    <Input.TextArea
                        placeholder="Nhập các mẫu, phân cách bằng dấu phẩy (vd: pattern1, pattern2)"
                        rows={2}
                        allowClear
                    />
                </AppFormItem>
            </AppForm>
        </Modal>
    );
};
