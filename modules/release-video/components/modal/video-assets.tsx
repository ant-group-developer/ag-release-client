import { ReleasesData } from '@/modules/releases/types';
import { FormInstance } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
    const [videoUrl, setVideoUrl] = useState<string>('');
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
                        {/* <div className="select-none text-5xl font-extrabold tracking-widest text-zinc-800">
                            vevo
                        </div> */}
                        <div className="select-none text-xl font-semibold uppercase tracking-wider text-zinc-600">
                            {messages('releaseVideo.fields.noVideoSelected')}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="mb-4 text-base font-bold tracking-wide">
                        {messages('releaseVideo.fields.assets')}
                    </h3>

                    {/* Asset: Video file */}
                    <VideoAssetItem
                        form={form}
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        dataEdit={dataEdit}
                        disabled={disabled}
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
