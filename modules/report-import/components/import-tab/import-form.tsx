import TenantSelect from '@/components/ui/select/tenant-select';
import { InboxOutlined } from '@ant-design/icons';
import { Checkbox, Form, FormInstance, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const ALLOWED_EXTENSIONS = {
    CSV: 'csv',
    TXT: 'txt',
} as const;

const DEFAULT_ALLOWED_EXTENSIONS = [ALLOWED_EXTENSIONS.CSV, ALLOWED_EXTENSIONS.TXT];

const EXTENSION_OPTIONS = [
    { label: 'CSV', value: ALLOWED_EXTENSIONS.CSV },
    { label: 'TXT', value: ALLOWED_EXTENSIONS.TXT },
];

interface ImportFormProps {
    form: FormInstance;
    onSubmit: (values: any) => void;
}

export const ImportForm: React.FC<ImportFormProps> = ({ form, onSubmit }) => {
    const messages = useTranslations();
    const allowedExtensions = Form.useWatch('allowedExtensions', form);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const accept = allowedExtensions
        ? allowedExtensions.map((ext: string) => `.${ext}`).join(',')
        : undefined;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
                allowedExtensions: DEFAULT_ALLOWED_EXTENSIONS,
            }}
            style={{ marginTop: 24 }}
        >
            <Form.Item
                name="tenantId"
                label={messages('tenant.label')}
                rules={[
                    {
                        required: true,
                        message: messages('validation.input'),
                    },
                ]}
            >
                <TenantSelect placeholder={messages('tenant.selectTitle')} />
            </Form.Item>

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
                <Checkbox.Group options={EXTENSION_OPTIONS} />
            </Form.Item>

            {/* File Upload Area */}
            <Form.Item label={messages('reportConfigs.selectFiles')} required>
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
                        accept={accept}
                        className="[&_.ant-upload-list]:max-h-[300px] [&_.ant-upload-list]:overflow-y-auto"
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
    );
};
