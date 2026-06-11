import { InboxOutlined } from '@ant-design/icons';
import { Checkbox, Form, FormInstance, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ImportFormProps {
    form: FormInstance;
    onSubmit: (values: any) => void;
}

export const ImportForm: React.FC<ImportFormProps> = ({ form, onSubmit }) => {
    const messages = useTranslations();

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
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
