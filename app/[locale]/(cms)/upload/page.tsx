'use client';

import { useActive } from '@/hooks/use-active';
import { uploadApi } from '@/modules/upload/apis';
import { useFileUpload } from '@/modules/upload/hooks/use-file-upload';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Upload } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

const UploadPage = () => {
    const [form] = Form.useForm();
    const { uploadFile, isLoading, error, fileId } = useFileUpload();
    const { isActive, deActive, active } = useActive();
    const [fileIdResponse, setFileIdResponse] = useState('');
    const handleSubmit = async (values: { folderId?: string; file?: any }) => {
        const fileList = values.file?.fileList ?? [];
        if (fileList.length === 0) {
            message.error('Please select a file to upload');
            return;
        }

        try {
            // await uploadFile(fileList[0].originFileObj, values.folderId);
            active();
            const fileId = await uploadApi.uploadFileToDriveV2(
                fileList[0].originFileObj,
                values.folderId
            );
            setFileIdResponse(fileId ?? '');
            deActive();
            message.success('File uploaded successfully');
            form.resetFields();
        } catch (err) {
            deActive();
            // Error is already handled by the hook
        }
    };

    const uploadProps = {
        beforeUpload: () => {
            return false; // Prevent default upload
        },
    };

    const cardTitle = () => {
        return (
            <p className="flex justify-between">
                <span>File Upload</span>
                <span>{fileIdResponse}</span>
            </p>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <Card title={cardTitle()} className="mx-auto max-w-2xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-4"
                >
                    <Form.Item
                        label="Folder ID"
                        name="folderId"
                        rules={[
                            {
                                pattern: /^[a-zA-Z0-9-_]+$/,
                                message:
                                    'Folder ID can only contain letters, numbers, hyphens, and underscores',
                            },
                        ]}
                    >
                        <Input placeholder="Enter folder ID (optional)" />
                    </Form.Item>

                    <Form.Item
                        label="File"
                        required
                        tooltip="Select a file to upload"
                        name="file"
                    >
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for single file upload
                            </p>
                        </Dragger>
                    </Form.Item>

                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isActive}
                        >
                            Upload
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UploadPage;
