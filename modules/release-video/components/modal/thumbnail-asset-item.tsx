import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { FormInstance, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ThumbnailAssetItemProps {
    form: FormInstance;
    dataEdit?: ReleasesData;
}

export default function ThumbnailAssetItem({
    form,
    dataEdit,
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
        if (thumbnailReadUrl) {
            setThumbnailUrl(thumbnailReadUrl);
            form.setFieldsValue({
                thumbnailFile: {
                    fileList: [
                        {
                            uid: coverArtFileId,
                            url: thumbnailReadUrl,
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
        } else if (!coverArtFileId) {
            setThumbnailUrl('');
            form.setFieldsValue({
                thumbnailFile: null,
            });
        }
    }, [
        thumbnailReadUrl,
        coverArtFileId,
        dataEdit?.title,
        form,
        messages,
        setThumbnailUrl,
    ]);

    const handleThumbnailUpload = async (info: any) => {
        setIsThumbnailUploading(true);
        const file = info.fileList[0];
        if (!file) {
            return;
        }
        const fileOriginal = file.originFileObj;
        if (!fileOriginal) return;

        const objectUrl = URL.createObjectURL(fileOriginal);
        const updatedFileList = info.fileList.map((item: any) =>
            item.uid === file.uid
                ? {
                      ...item,
                      status: 'uploading',
                      percent: 99,
                      url: objectUrl,
                      thumbUrl: objectUrl,
                  }
                : item
        );
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

                            const successFileList = info.fileList.map(
                                (item: any) =>
                                    item.uid === file.uid
                                        ? {
                                              ...item,
                                              status: 'done',
                                              url: objectUrl,
                                              thumbUrl: objectUrl,
                                              originFileObj: fileOriginal,
                                              name: fileOriginal.name,
                                          }
                                        : item
                            );
                            form.setFieldsValue({
                                thumbnailFile: {
                                    ...info,
                                    fileList: successFileList,
                                },
                            });
                        },
                        onError: () => {
                            setIsThumbnailUploading(false);
                            form.setFieldsValue({
                                thumbnailFile: null,
                            });
                        },
                    });
                } else {
                    setIsThumbnailUploading(false);
                    setThumbnailUrl(objectUrl);
                    const successFileList = info.fileList.map((item: any) =>
                        item.uid === file.uid
                            ? {
                                  ...item,
                                  status: 'done',
                                  url: objectUrl,
                                  thumbUrl: objectUrl,
                                  originFileObj: fileOriginal,
                                  name: fileOriginal.name,
                              }
                            : item
                    );
                    form.setFieldsValue({
                        thumbnailFile: {
                            ...info,
                            fileList: successFileList,
                        },
                    });
                }
            } else {
                setIsThumbnailUploading(false);
                form.setFieldsValue({
                    thumbnailFile: null,
                });
            }
        } catch (error) {
            console.error('Thumbnail upload failed:', error);
            setIsThumbnailUploading(false);
            form.setFieldsValue({
                thumbnailFile: null,
            });
        }
    };

    const fileList = form.getFieldValue('thumbnailFile')?.fileList || [];

    const handleRemove = () => {
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
                                form.setFieldsValue({
                                    thumbnailFile: null,
                                });
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
                        form.setFieldsValue({
                            thumbnailFile: null,
                        });
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
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-800">
                <span>{messages('releaseVideo.fields.thumbnailFile')} *</span>
            </div>

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
                    // loading={isThumbnailUploading}
                    accept="image/*"
                    maxCount={1}
                    value={form.getFieldValue('thumbnailFile')}
                    placeholder={messages('common.uploadImage')}
                    onChange={handleThumbnailUpload}
                    onRemove={handleRemove}
                />
            </AppFormItem>
        </div>
    );
}
