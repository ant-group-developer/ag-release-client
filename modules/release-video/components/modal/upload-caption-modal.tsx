import AppModal from '@/components/ui/modal/normal-modal';
import LanguageSelect from '@/components/ui/select/language-select';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { useUpsertReleaseCaptions } from '@/modules/releases/hooks/use-upsert-release-captions';
import { useUpdateReleaseCaption } from '@/modules/releases/hooks/use-update-release-caption';
import { ReleaseCaptionData } from '@/modules/releases/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { FileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Typography, Upload } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const { Text } = Typography;

interface UploadCaptionModalProps {
    isOpen: boolean;
    type: RELEASE_VIDEO_CAPTION_TYPE;
    initialData?: ReleaseCaptionData;
    onClose: () => void;
}

export default function UploadCaptionModal({
    isOpen,
    type,
    initialData,
    onClose,
}: UploadCaptionModalProps) {
    const [form] = Form.useForm();
    const [isUploading, setIsUploading] = useState(false);

    const messages = useTranslations();
    const params = useParams<{ id: string }>();
    const { upsertReleaseCaptions } = useUpsertReleaseCaptions();
    const { updateReleaseCaption } = useUpdateReleaseCaption();

    const language = Form.useWatch('language', form);
    const fileList = Form.useWatch('file', form) || [];

    useEffect(() => {
        if (isOpen && initialData) {
            form.setFieldsValue({
                language: initialData.languageId,
                file: [
                    {
                        uid: '-1',
                        name: initialData.file?.fileName || 'Existing file',
                        status: 'done',
                    },
                ],
            });
        }
    }, [isOpen, initialData, form]);

    const handleUpload = () => {
        form.validateFields().then(async (values) => {
            const isNewFile = !!values.file?.[0]?.originFileObj;
            if (!isNewFile && !initialData) return;

            setIsUploading(true);
            try {
                let fileId = initialData?.fileId;

                if (isNewFile) {
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

                    const newFileId = await bucketApi.createBucket(
                        fileOriginal,
                        payload
                    );
                    if (newFileId) {
                        await bucketApi.submit({ ids: [newFileId] });
                        fileId = newFileId;
                    } else {
                        setIsUploading(false);
                        return;
                    }
                }

                const payload = {
                    languageId: values.language,
                    type: type,
                    fileId: fileId as string,
                };

                const onSuccess = () => {
                    setIsUploading(false);
                    handleClose();
                };

                const onError = () => {
                    setIsUploading(false);
                };

                if (initialData) {
                    updateReleaseCaption({
                        payload: {
                            ...payload,
                            id: initialData.id,
                        },
                        onSuccess,
                        onError,
                    });
                } else {
                    upsertReleaseCaptions({
                        payload: {
                            ...payload,
                            releaseId: params?.id ?? '',
                        },
                        onSuccess,
                        onError,
                    });
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
                    {initialData
                        ? messages('releaseVideo.captions.uploadModal.titleEdit', {
                              type:
                                  type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION
                                      ? messages('releaseVideo.captions.uploadModal.caption')
                                      : messages('releaseVideo.captions.uploadModal.subtitle'),
                          })
                        : messages('releaseVideo.captions.uploadModal.titleUpload', {
                              type:
                                  type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION
                                      ? messages('releaseVideo.captions.uploadModal.caption')
                                      : messages('releaseVideo.captions.uploadModal.subtitle'),
                          })}
                </Text>
            }
            open={isOpen}
            onCancel={handleClose}
            loading={isUploading}
            onOk={handleUpload}
            okButtonProps={{ disabled: !fileList.length || !language }}
            width={550}
        >
            <Form form={form} layout="vertical" disabled={isUploading}>
                <Flex vertical gap={20}>
                    <Text>
                        {messages('releaseVideo.captions.uploadModal.description', {
                            type:
                                type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION
                                    ? messages('releaseVideo.captions.uploadModal.caption')
                                    : messages('releaseVideo.captions.uploadModal.subtitle'),
                        })}
                    </Text>

                    <Form.Item
                        label={messages('releaseVideo.captions.uploadModal.selectFile')}
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                            { required: true, message: messages('releaseVideo.captions.uploadModal.fileRequired') },
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
                                    {messages('releaseVideo.captions.table.upload')}
                                </Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label={messages('releaseVideo.captions.uploadModal.language')}
                        name="language"
                        rules={[
                            {
                                required: true,
                                message: messages('releaseVideo.captions.uploadModal.languageRequired'),
                            },
                        ]}
                    >
                        <LanguageSelect
                            placeholder={messages('releaseVideo.captions.uploadModal.select')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Flex>
            </Form>
        </AppModal>
    );
}
