import { ReleasesData } from '@/modules/releases/types';
import {
    useMultipartVideoUpload,
} from '@/modules/release-video/hooks/use-multipart-video-upload';
import { FormInstance, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import CaptionsAssetItem from './captions-asset-item';
import ThumbnailAssetItem from './thumbnail-asset-item';
import VideoAssetItem from './video-asset-item';

interface VideoAssetsProps {
    form: FormInstance;
    dataEdit?: ReleasesData;
    disabled?: boolean;
}

export default function VideoAssets({
    form,
    dataEdit,
    disabled = false,
}: VideoAssetsProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [videoUrl, setVideoUrl] = useState<string>('');
    const previewObjectUrlRef = useRef<string | null>(null);

    // Coordinate multipart upload state
    const upload = useMultipartVideoUpload({
        releaseId: dataEdit?.id,
        onCompleted: ({ readUrl, file }) => {
            // Clean up any previous object URL
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
                previewObjectUrlRef.current = null;
            }

            if (readUrl) {
                setVideoUrl(readUrl);
            } else if (file) {
                const objectUrl = URL.createObjectURL(file);
                previewObjectUrlRef.current = objectUrl;
                setVideoUrl(objectUrl);
            }
        },
    });

    // Revoke object URL on unmount
    useEffect(() => {
        return () => {
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* Video Player Display Screen */}
            <div
                className={`group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl transition-all ${
                    videoUrl
                        ? 'border-none bg-transparent'
                        : 'border border-gray-800 bg-black shadow-inner'
                }`}
            >
                {videoUrl ? (
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        style={{ borderRadius: '12px', overflow: 'hidden' }}
                        config={{
                            file: {
                                attributes: {
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    },
                                },
                            },
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                        <div className="select-none text-xl font-semibold uppercase tracking-wider text-zinc-600">
                            {messages('releaseVideo.fields.noVideoSelected')}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div
                    className="mt-6 pt-6"
                    style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}
                >
                    {/* Asset: Video file */}
                    <VideoAssetItem
                        form={form}
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        dataEdit={dataEdit}
                        disabled={disabled}
                        upload={upload}
                    />

                    {/* Asset: Thumbnail */}
                    <ThumbnailAssetItem
                        form={form}
                        dataEdit={dataEdit}
                        disabled={disabled}
                    />

                    {/* Asset: Captions and Subtitles */}
                    <CaptionsAssetItem
                        dataEdit={dataEdit}
                        disabled={disabled}
                    />
                </div>
            </div>
        </>
    );
}
