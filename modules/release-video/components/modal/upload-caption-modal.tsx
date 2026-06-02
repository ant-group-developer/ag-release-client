import AppModal from '@/components/ui/modal/normal-modal';
import LanguageSelect from '@/components/ui/select/language-select';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { useBulkUpsertCaptions } from '@/modules/releases/hooks/use-bulk-upsert-captions';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { FileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Typography, Upload } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const { Text } = Typography;

interface UploadCaptionModalProps {
    isOpen: boolean;
    type: RELEASE_VIDEO_CAPTION_TYPE;
    onClose: () => void;
}

export default function UploadCaptionModal({
    isOpen,
    type,
    onClose,
}: UploadCaptionModalProps) {
    const [form] = Form.useForm();
    const [isUploading, setIsUploading] = useState(false);

    const params = useParams<{ id: string }>();
    const { bulkUpsertCaptions } = useBulkUpsertCaptions();

    const language = Form.useWatch('language', form);
    const fileList = Form.useWatch('file', form) || [];

    const handleUpload = () => {
        form.validateFields().then(async (values) => {
            if (!values.file?.[0]?.originFileObj) return;

            setIsUploading(true);
            try {
                const fileOriginal = values.file[0].originFileObj as File;
                const payload = {
                    folderBucket: {
                        releaseId: params?.id ?? '',
                        uploadPurpose: TYPE_UPLOAD_BUCKET.VIDEO_CAPTION,
                    },
                    file: {
                        fileName: fileOriginal.name,
                        contentType:
                            fileOriginal.type ||
                            (fileOriginal.name.endsWith('.ttml')
                                ? 'application/xml'
                                : fileOriginal.name.endsWith('.srt')
                                ? 'text/plain'
                                : 'application/octet-stream'),
                        extension: fileOriginal.name.split('.').pop() || '',
                        fileSize: fileOriginal.size,
                    },
                };

                const fileId = await bucketApi.createBucket(
                    fileOriginal,
                    payload
                );
                if (fileId) {
                    await bucketApi.submit({ ids: [fileId] });

                    bulkUpsertCaptions({
                        payload: {
                            videoId: params?.id ?? '',
                            captions: [
                                {
                                    languageId: values.language,
                                    type: type,
                                    fileId: fileId,
                                },
                            ],
                        },
                        onSuccess: () => {
                            setIsUploading(false);
                            handleClose();
                        },
                        onError: () => {
                            setIsUploading(false);
                        },
                    });
                } else {
                    setIsUploading(false);
                }
            } catch (error) {
                console.error('Caption upload failed:', error);
                setIsUploading(false);
            }
        });
    };

    const handleClose = () => {
        onClose();
        form.resetFields();
    };

    return (
        <AppModal
            title={
                <Text strong>
                    Upload{' '}
                    {type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION
                        ? 'caption'
                        : 'subtitle'}{' '}
                    file
                </Text>
            }
            open={isOpen}
            onCancel={handleClose}
            loading={isUploading}
            onOk={handleUpload}
            okButtonProps={{ disabled: !fileList.length || !language }}
            width={550}
        >
            <Form form={form} layout="vertical">
                <Flex vertical gap={20}>
                    <Text>
                        Only one{' '}
                        {type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION
                            ? 'caption'
                            : 'subtitle'}{' '}
                        file is allowed and must be in the language of the
                        video.
                    </Text>

                    <Form.Item
                        label="Select file (.ttml or .srt)"
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                            { required: true, message: 'Please select a file' },
                        ]}
                    >
                        <Upload
                            accept=".ttml,.srt"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            iconRender={() => <FileOutlined />}
                        >
                            {fileList.length < 1 && (
                                <Button block icon={<UploadOutlined />}>
                                    Upload
                                </Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Language"
                        name="language"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a language',
                            },
                        ]}
                    >
                        <LanguageSelect
                            placeholder="Select..."
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Flex>
            </Form>
        </AppModal>
    );
}
