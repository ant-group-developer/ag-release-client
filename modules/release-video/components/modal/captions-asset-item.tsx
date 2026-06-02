import { ReleasesData } from '@/modules/releases/types';
import { useTranslations } from 'next-intl';

interface CaptionsAssetItemProps {
    dataEdit?: ReleasesData;
}

export default function CaptionsAssetItem({
    dataEdit,
}: CaptionsAssetItemProps) {
    const messages = useTranslations();
    // Currently captions are read from video details or kept as placeholder
    const captionCount = dataEdit?.video?.subtitles?.length || 0;

    return (
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <span>
                    {messages('releaseVideo.fields.captionsAndSubtitles')}
                </span>
                <span className="text-gray-300">|</span>
                <span className="cursor-pointer text-blue-500 transition-all hover:text-blue-600 hover:underline">
                    {messages('releaseVideo.fields.manage')}
                </span>
            </div>
            <div className="mt-1 text-xs font-medium text-gray-500">
                {messages('releaseVideo.fields.captionFilesSummary', {
                    captionCount,
                    subtitleCount: captionCount,
                })}
            </div>
        </div>
    );
}
