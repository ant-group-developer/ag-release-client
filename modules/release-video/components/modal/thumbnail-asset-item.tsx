import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { PictureOutlined } from '@ant-design/icons';
import { FormInstance, Modal, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ThumbnailAssetItemProps {
    form: FormInstance;
    dataEdit?: ReleasesData;
    disabled?: boolean;
}

export default function ThumbnailAssetItem({
    form,
    dataEdit,
    disabled = false,
}: ThumbnailAssetItemProps) {
    const messages = useTranslations();
    const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    // Load existing thumbnail cover art
    const coverArtFileId =
        dataEdit?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL] ?? '';
    const { linkReadFile: thumbnailReadUrl } =
        useGetLinkReadFile(coverArtFileId);

    useEffect(() => {
        if (thumbnailReadUrl && coverArtFileId) {
            setThumbnailUrl(thumbnailReadUrl);
            form.setFieldsValue({
                thumbnailFile: {
                    fileList: [
                        {
                            uid: coverArtFileId,
                            url: thumbnailReadUrl,
                            thumbUrl: thumbnailReadUrl,
                            name: dataEdit?.title
                                ? messages(
                                      'releaseVideo.fields.thumbnailFileName',
                                      {
                                          title: dataEdit.title,
                                      }
                                  )
                                : messages('releaseVideo.fields.thumbnailFile'),
                            status: 'done',
                        },
                    ],
                },
            });
        }
    }, [thumbnailReadUrl, coverArtFileId, dataEdit?.title, form, messages]);

    const handleThumbnailUpload = async (info: any) => {
        if (disabled) return;
        const file = info.fileList?.[0];
        if (!file || !file.originFileObj) {
            return;
        }
        setIsThumbnailUploading(true);
        const fileOriginal = file.originFileObj;

        const objectUrl = URL.createObjectURL(fileOriginal);
        const updatedFileList = [
            {
                uid: file.uid,
                name: fileOriginal.name,
                status: 'uploading',
                percent: 99,
                url: objectUrl,
                thumbUrl: objectUrl,
                originFileObj: fileOriginal,
            },
        ];
        form.setFieldsValue({
            thumbnailFile: {
                ...info,
                fileList: updatedFileList,
            },
        });

        try {
            const payload: CreateBucketFile = {
                folderBucket: {
                    releaseId: dataEdit?.id ?? '',
                    uploadPurpose: TYPE_UPLOAD_BUCKET.RELEASE_COVER_ART,
                },
                file: {
                    fileName: fileOriginal.name,
                    contentType: fileOriginal.type,
                    extension: fileOriginal.name.split('.').pop() || '',
                    fileSize: fileOriginal.size,
                },
            };

            const fileId = await bucketApi.createBucket(fileOriginal, payload);
            if (fileId) {
                await bucketApi.submit({ ids: [fileId] });

                if (dataEdit?.id) {
                    updateReleaseDraft({
                        id: dataEdit.id,
                        payload: {
                            releaseCoverArt: {
                                fileId,
                            },
                        },
                        onSuccess: () => {
                            setIsThumbnailUploading(false);
                            setThumbnailUrl(objectUrl);

                            const successFileList = [
                                {
                                    uid: fileId,
                                    name: fileOriginal.name,
                                    status: 'done',
                                    url: objectUrl,
                                    thumbUrl: objectUrl,
                                    originFileObj: fileOriginal,
                                },
                            ];
                            form.setFieldsValue({
                                thumbnailFile: {
                                    fileList: successFileList,
                                },
                            });
                        },
                        onError: () => {
                            setIsThumbnailUploading(false);
                            form.setFields([
                                {
                                    name: 'thumbnailFile',
                                    value: null,
                                    errors: [],
                                },
                            ]);
                        },
                    });
                } else {
                    setIsThumbnailUploading(false);
                    setThumbnailUrl(objectUrl);
                    const successFileList = [
                        {
                            uid: fileId || file.uid,
                            name: fileOriginal.name,
                            status: 'done',
                            url: objectUrl,
                            thumbUrl: objectUrl,
                            originFileObj: fileOriginal,
                        },
                    ];
                    form.setFieldsValue({
                        thumbnailFile: {
                            fileList: successFileList,
                        },
                    });
                }
            } else {
                setIsThumbnailUploading(false);
                form.setFields([
                    {
                        name: 'thumbnailFile',
                        value: null,
                        errors: [],
                    },
                ]);
            }
        } catch (error) {
            console.error('Thumbnail upload failed:', error);
            setIsThumbnailUploading(false);
            form.setFields([
                {
                    name: 'thumbnailFile',
                    value: null,
                    errors: [],
                },
            ]);
        }
    };

    // const fileList = form.getFieldValue('thumbnailFile')?.fileList || [];

    const handleRemove = () => {
        if (disabled) return false;
        return new Promise<boolean>((resolve) => {
            Modal.confirm({
                title: messages('delete.confirmTitle'),
                content: messages('delete.confirmMessage', {
                    value: messages('common.thumbnail'),
                }),
                okText: messages('common.yes'),
                cancelText: messages('common.cancel'),
                onOk: async () => {
                    if (dataEdit?.id) {
                        setIsThumbnailUploading(true);
                        updateReleaseDraft({
                            id: dataEdit.id,
                            payload: {
                                releaseCoverArt: null,
                            },
                            onSuccess: () => {
                                setThumbnailUrl('');
                                form.setFields([
                                    {
                                        name: 'thumbnailFile',
                                        value: null,
                                        errors: [],
                                    },
                                ]);
                                setIsThumbnailUploading(false);
                                resolve(true);
                            },
                            onError: () => {
                                setIsThumbnailUploading(false);
                                resolve(false);
                            },
                        });
                    } else {
                        setThumbnailUrl('');
                        form.setFields([
                            {
                                name: 'thumbnailFile',
                                value: null,
                                errors: [],
                            },
                        ]);
                        resolve(true);
                    }
                },
                onCancel: () => {
                    resolve(false);
                },
            });
        });
    };

    return (
        <div className="thumbnail-upload-container mb-5">
            <Space className="mb-2 font-bold">
                <span>{messages('releaseVideo.fields.thumbnailFile')}</span>
                <span className="text-red-500">*</span>
            </Space>

            <AppFormItem
                name="thumbnailFile"
                rules={[
                    {
                        validator: async (_, value) => {
                            if (
                                !value ||
                                !value.fileList ||
                                value.fileList.length === 0
                            ) {
                                return Promise.reject(
                                    new Error(
                                        messages(
                                            'releaseVideo.fields.thumbnailNotUploaded'
                                        )
                                    )
                                );
                            }
                            if (isThumbnailUploading) {
                                return Promise.reject(
                                    new Error(messages('common.processing'))
                                );
                            }
                        },
                    },
                ]}
            >
                <ImageListUpload
                    id="thumbnailFile"
                    loading={isThumbnailUploading}
                    accept="image/*"
                    maxCount={1}
                    imageFit="contain"
                    previewAspectRatio="16/9"
                    value={form.getFieldValue('thumbnailFile')}
                    placeholder={messages('common.uploadImage')}
                    disabled={disabled || isThumbnailUploading}
                    onChange={handleThumbnailUpload}
                    onRemove={handleRemove}
                    uploadButton={
                        <div className="flex flex-col items-center justify-center gap-1.5 p-2">
                            <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-950/50">
                                <PictureOutlined style={{ fontSize: 20 }} />
                            </div>
                            <Typography.Text strong style={{ fontSize: 13 }}>
                                {messages('common.uploadImage')}
                            </Typography.Text>
                            <Typography.Text
                                type="secondary"
                                style={{ fontSize: 11 }}
                            >
                                PNG, JPG, JPEG (16:9 • Max 5MB)
                            </Typography.Text>
                        </div>
                    }
                />
            </AppFormItem>
        </div>
    );
}
