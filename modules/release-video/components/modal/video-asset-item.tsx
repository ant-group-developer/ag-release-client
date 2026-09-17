import AppFormItem from '@/components/ui/antd-form/form-Item';
import { formatFileSize2 } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import {
    MAX_VIDEO_SIZE,
    useMultipartVideoUpload,
} from '@/modules/release-video/hooks/use-multipart-video-upload';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { VideoCameraOutlined } from '@ant-design/icons';
import {
    Button,
    FormInstance,
    Modal,
    Space,
    Tag,
    Typography,
    Upload,
    theme,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import VideoUploadProgress from './video-upload-progress';
import VideoUploadResumeBanner from './video-upload-resume-banner';

const { Text } = Typography;

interface VideoAssetItemProps {
    form: FormInstance;
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    dataEdit?: ReleasesData;
    disabled?: boolean;
    upload: ReturnType<typeof useMultipartVideoUpload>;
}

export default function VideoAssetItem({
    form,
    videoUrl,
    setVideoUrl,
    dataEdit,
    disabled = false,
    upload,
}: VideoAssetItemProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isRemoving, setIsRemoving] = useState(false);
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    // Load existing video file
    const videoFileId = dataEdit?.video?.fileId ?? '';
    const { linkReadFile: videoReadUrl } = useGetLinkReadFile(videoFileId);

    // Synchronize initial existing file from dataEdit
    useEffect(() => {
        if (videoReadUrl && videoFileId && upload.phase === 'idle') {
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
        } else if (!videoFileId && upload.phase === 'idle' && !upload.file) {
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
        upload.phase,
        upload.file,
        dataEdit?.title,
        dataEdit?.video?.videoFile?.fileName,
        form,
        messages,
        setVideoUrl,
        videoUrl,
    ]);

    // Synchronize upload completion with form
    useEffect(() => {
        if (upload.phase === 'completed' && upload.fileId) {
            form.setFieldsValue({
                videoFile: {
                    file: upload.file,
                    fileList: [
                        {
                            originFileObj: upload.file,
                            uid: upload.fileId,
                            name: upload.file?.name || '',
                            status: 'done' as const,
                        },
                    ],
                },
            });
        }
    }, [upload.phase, upload.fileId, upload.file, form]);

    const isDraft = !dataEdit?.id || dataEdit?.status === RELEASES_STATUS.DRAFT;

    const isUploading =
        upload.phase === 'initiating' ||
        upload.phase === 'uploading' ||
        upload.phase === 'completing' ||
        upload.phase === 'saving' ||
        upload.phase === 'canceling';

    const isVideoDisabled = disabled || isUploading || isRemoving || !isDraft;

    const handleBeforeUpload = (file: File) => {
        if (isVideoDisabled) return Upload.LIST_IGNORE;

        const isVideo = file.type.startsWith('video/');
        if (!isVideo) {
            showNotification(
                'error',
                messages('releaseVideo.fields.invalidVideoFile')
            );
            return Upload.LIST_IGNORE;
        }

        if (file.size > MAX_VIDEO_SIZE) {
            showNotification(
                'error',
                messages('releaseVideo.fields.maxVideoFileSize', {
                    size: formatFileSize2(MAX_VIDEO_SIZE) || '30GB',
                })
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

        form.setFieldsValue({
            videoFile: {
                file,
                fileList: [
                    {
                        uid: '-1',
                        name: file.name,
                        status: 'uploading' as const,
                        percent: 0,
                        originFileObj: file,
                    },
                ],
            },
        });

        upload.start(file);
        return false;
    };

    const handleCancelUpload = () => {
        Modal.confirm({
            title: messages('releaseVideo.fields.cancelUploadConfirmTitle'),
            content: messages('releaseVideo.fields.cancelUploadConfirmMessage'),
            okText: messages('common.yes'),
            cancelText: messages('common.cancel'),
            okButtonProps: { danger: true },
            onOk: async () => {
                await upload.cancel();
                form.setFieldsValue({
                    videoFile: null,
                });
            },
        });
    };

    const handleRemove = () => {
        if (isVideoDisabled) return false;
        return new Promise<boolean>((resolve) => {
            Modal.confirm({
                title: messages('releaseVideo.fields.removeVideoConfirmTitle'),
                content: messages(
                    'releaseVideo.fields.removeVideoConfirmMessage'
                ),
                okText: messages('common.yes'),
                cancelText: messages('common.cancel'),
                okButtonProps: { danger: true },
                onOk: async () => {
                    if (dataEdit?.id) {
                        setIsRemoving(true);
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
                                upload.reset();
                                setIsRemoving(false);
                                resolve(true);
                            },
                            onError: () => {
                                setIsRemoving(false);
                                resolve(false);
                            },
                        });
                    } else {
                        setVideoUrl('');
                        form.setFieldsValue({
                            videoFile: null,
                        });
                        upload.reset();
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
    const fileSize = dataEdit?.video?.videoFile?.fileSize || upload.file?.size;

    return (
        <div className="mb-5">
            <div className="mb-1 flex w-full items-center justify-between">
                <Space className="text-xs font-bold">
                    <Text strong className="text-xs">
                        {messages('releaseVideo.fields.videoFile')}
                    </Text>
                    <Text type="danger">*</Text>
                </Space>
                {fileSize ? (
                    <Tag color="blue" bordered={false}>
                        {formatFileSize2(fileSize)}
                    </Tag>
                ) : null}
            </div>

            <AppFormItem
                name="videoFile"
                rules={[
                    {
                        validator: async (_, value) => {
                            if (isUploading) {
                                return Promise.reject(
                                    new Error(messages('common.processing'))
                                );
                            }
                            if (upload.canResume && upload.phase === 'idle') {
                                return Promise.resolve();
                            }
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
                        },
                    },
                ]}
            >
                {/* 1. Resume Banner if there is an interrupted session */}
                {upload.canResume &&
                upload.phase === 'idle' &&
                upload.resumeDescriptor ? (
                    <VideoUploadResumeBanner
                        descriptor={upload.resumeDescriptor}
                        onResumeFileSelected={(file) => upload.resume(file)}
                        onCancel={() => upload.cancel()}
                        disabled={disabled}
                    />
                ) : upload.phase !== 'idle' && upload.phase !== 'completed' ? (
                    /* 2. Uploading / In-progress view */
                    <VideoUploadProgress
                        phase={upload.phase}
                        fileName={
                            upload.file?.name ||
                            upload.resumeDescriptor?.fileName
                        }
                        fileSize={
                            upload.file?.size ||
                            upload.resumeDescriptor?.fileSize
                        }
                        percent={upload.percent}
                        speed={upload.speed}
                        loaded={upload.loaded}
                        total={upload.total}
                        completedParts={upload.completedParts}
                        partCount={upload.partCount}
                        error={upload.error}
                        onRetry={() => upload.retry()}
                        onCancel={handleCancelUpload}
                        disabled={disabled}
                    />
                ) : (
                    /* 3. Standard Idle or Completed view */
                    <div>
                        <Upload
                            accept="video/*"
                            fileList={fileList}
                            disabled={isVideoDisabled}
                            showUploadList={{
                                showRemoveIcon: true,
                            }}
                            beforeUpload={handleBeforeUpload}
                            onRemove={handleRemove}
                            listType="picture"
                            iconRender={() => (
                                <VideoCameraOutlined
                                    style={{
                                        fontSize: 24,
                                        color: token.colorPrimary,
                                    }}
                                />
                            )}
                        >
                            {fileList.length < 1 && (
                                <Button
                                    icon={<VideoCameraOutlined />}
                                    disabled={isVideoDisabled}
                                >
                                    {messages('common.upload')}
                                </Button>
                            )}
                        </Upload>
                        <Text
                            type="secondary"
                            className="mt-1.5 block !text-xs"
                        >
                            {messages('common.maxUploadSize', {
                                size: formatFileSize2(MAX_VIDEO_SIZE),
                            })}
                        </Text>
                    </div>
                )}
            </AppFormItem>
        </div>
    );
}
