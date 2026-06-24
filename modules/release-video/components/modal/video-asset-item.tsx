import axiosInstance from '@/api/axios-auth';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { showNotification } from '@/helpers/messages-helper';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { VideoCameraOutlined } from '@ant-design/icons';
import { Button, FormInstance, Modal, Space, Upload } from 'antd';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface VideoAssetItemProps {
    form: FormInstance;
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    dataEdit?: ReleasesData;
    disabled?: boolean;
}

export default function VideoAssetItem({
    form,
    videoUrl,
    setVideoUrl,
    dataEdit,
    disabled = false,
}: VideoAssetItemProps) {
    const messages = useTranslations();
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    // Load existing video file
    const videoFileId = dataEdit?.video?.fileId ?? '';
    const { linkReadFile: videoReadUrl } = useGetLinkReadFile(videoFileId);

    useEffect(() => {
        if (videoReadUrl && videoFileId) {
            const currentFileList =
                form.getFieldValue('videoFile')?.fileList || [];
            const hasExistingFile = currentFileList.some(
                (file: any) => file.uid === videoFileId
            );

            if (!hasExistingFile || currentFileList.length === 0 || !videoUrl) {
                if (!videoUrl) {
                    setVideoUrl(videoReadUrl);
                }
                form.setFieldsValue({
                    videoFile: {
                        fileList: [
                            {
                                uid: videoFileId,
                                name:
                                    dataEdit?.video?.videoFile?.fileName ||
                                    (dataEdit?.title
                                        ? messages(
                                              'releaseVideo.fields.videoFileName',
                                              { title: dataEdit.title }
                                          )
                                        : messages(
                                              'releaseVideo.fields.videoFile'
                                          )),
                                status: 'done',
                            },
                        ],
                    },
                });
            }
        } else if (!videoFileId) {
            const currentVideoFile = form.getFieldValue('videoFile');
            if (currentVideoFile !== null || videoUrl) {
                if (videoUrl) {
                    setVideoUrl('');
                }
                form.setFieldsValue({
                    videoFile: null,
                });
            }
        }
    }, [
        videoReadUrl,
        videoFileId,
        dataEdit?.title,
        form,
        messages,
        setVideoUrl,
        videoUrl,
    ]);

    const handleVideoUpload = async (file: File) => {
        if (disabled) return;
        if (!dataEdit?.id) return;
        setIsVideoUploading(true);

        const initialFile = {
            uid: '-1',
            name: file.name,
            status: 'uploading' as const,
            percent: 0,
            originFileObj: file,
        };
        form.setFieldsValue({
            videoFile: {
                file,
                fileList: [initialFile],
            },
        });

        try {
            const payload: CreateBucketFile = {
                folderBucket: {
                    releaseId: dataEdit.id,
                    uploadPurpose: TYPE_UPLOAD_BUCKET.VIDEO_FILE,
                },
                file: {
                    fileName: file.name,
                    contentType: file.type,
                    extension: file.name.split('.').pop() || '',
                    fileSize: file.size,
                },
            };

            // 1. Retrieve pre-signed URL
            const response = await axiosInstance.post(
                '/bucket2/private',
                payload
            );
            if (response.status !== 201) {
                throw new Error(
                    'Failed to get upload URL. Please try again later.'
                );
            }

            const { fileId, urlUpload } = response.data.data;

            // Update the file list item with the final fileId
            form.setFieldsValue({
                videoFile: {
                    file,
                    fileList: [
                        {
                            uid: fileId,
                            name: file.name,
                            status: 'uploading' as const,
                            percent: 0,
                            originFileObj: file,
                        },
                    ],
                },
            });

            // 2. Perform PUT request with progress tracking
            const uploadResponse = await axios.put(urlUpload, file, {
                headers: {
                    'Content-Type': file.type || 'application/octet-stream',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) /
                            (progressEvent.total || 1)
                    );
                    form.setFieldsValue({
                        videoFile: {
                            file,
                            fileList: [
                                {
                                    uid: fileId,
                                    name: file.name,
                                    status: 'uploading' as const,
                                    percent,
                                    originFileObj: file,
                                },
                            ],
                        },
                    });
                },
            });

            if (!uploadResponse.status || uploadResponse.status >= 400) {
                throw new Error(
                    'Failed to upload file. Please try again later.'
                );
            }

            // 3. Submit the file id
            await bucketApi.submit({ ids: [fileId] });

            // 4. Update the draft
            updateReleaseDraft({
                id: dataEdit.id,
                payload: {
                    video: {
                        fileId: fileId as string,
                    },
                },
                onSuccess: () => {
                    setIsVideoUploading(false);
                    const objectUrl = URL.createObjectURL(file);
                    setVideoUrl(objectUrl);

                    form.setFieldsValue({
                        videoFile: {
                            file,
                            fileList: [
                                {
                                    originFileObj: file,
                                    uid: fileId,
                                    name: file.name,
                                    status: 'done' as const,
                                },
                            ],
                        },
                    });
                },
                onError: () => {
                    setIsVideoUploading(false);
                    form.setFieldsValue({
                        videoFile: null,
                    });
                },
            });
        } catch (error) {
            console.error('Video upload failed:', error);
            setIsVideoUploading(false);
            form.setFieldsValue({
                videoFile: null,
            });
        }
    };

    const handleRemove = () => {
        if (disabled) return false;
        return new Promise<boolean>((resolve) => {
            Modal.confirm({
                title: messages('delete.confirmTitle'),
                content: messages('delete.confirmMessage', {
                    value: messages('common.video'),
                }),
                okText: messages('common.yes'),
                cancelText: messages('common.cancel'),
                onOk: async () => {
                    if (dataEdit?.id) {
                        setIsVideoUploading(true);
                        updateReleaseDraft({
                            id: dataEdit.id,
                            payload: {
                                video: {
                                    fileId: undefined,
                                },
                            },
                            onSuccess: () => {
                                setVideoUrl('');
                                form.setFieldsValue({
                                    videoFile: null,
                                });
                                setIsVideoUploading(false);
                                resolve(true);
                            },
                            onError: () => {
                                setIsVideoUploading(false);
                                resolve(false);
                            },
                        });
                    } else {
                        setVideoUrl('');
                        form.setFieldsValue({
                            videoFile: null,
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

    const fileList = form.getFieldValue('videoFile')?.fileList || [];

    return (
        <div className="mb-5">
            <Space className="text-xs font-bold">
                <span>{messages('releaseVideo.fields.videoFile')}</span>
                <span className="text-red-500">*</span>
            </Space>

            <AppFormItem
                name="videoFile"
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
                                            'releaseVideo.fields.videoNotUploaded'
                                        )
                                    )
                                );
                            }
                            if (isVideoUploading) {
                                return Promise.reject(
                                    new Error(messages('common.processing'))
                                );
                            }
                        },
                    },
                ]}
            >
                <Upload
                    accept="video/*"
                    fileList={fileList}
                    disabled={disabled || isVideoUploading}
                    beforeUpload={(file) => {
                        const isVideo = file.type.startsWith('video/');
                        if (!isVideo) {
                            showNotification(
                                'error',
                                messages('releaseVideo.fields.invalidVideoFile')
                            );
                            return Upload.LIST_IGNORE;
                        }
                        if (file.name.length > 500) {
                            showNotification(
                                'error',
                                messages('track.validation.trackFileName', {
                                    number: 500,
                                })
                            );
                            return Upload.LIST_IGNORE;
                        }
                        handleVideoUpload(file);
                        return false;
                    }}
                    onRemove={handleRemove}
                    listType="picture"
                    iconRender={() => (
                        <VideoCameraOutlined
                            style={{ fontSize: 24, color: '#3b82f6' }}
                        />
                    )}
                >
                    {fileList.length < 1 && (
                        <Button
                            icon={<VideoCameraOutlined />}
                            disabled={disabled || isVideoUploading}
                        >
                            {messages('common.upload')}
                        </Button>
                    )}
                </Upload>
            </AppFormItem>
        </div>
    );
}
