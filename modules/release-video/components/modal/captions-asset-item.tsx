import { ReleasesData } from '@/modules/releases/types';

interface CaptionsAssetItemProps {
    dataEdit?: ReleasesData;
}

export default function CaptionsAssetItem({
    dataEdit,
}: CaptionsAssetItemProps) {
    // Currently captions are read from video details or kept as placeholder
    const captionCount = dataEdit?.video?.subtitles?.length || 0;

    return (
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <span>Captions and subtitles</span>
                <span className="text-gray-300">|</span>
                <span className="cursor-pointer text-blue-500 transition-all hover:text-blue-600 hover:underline">
                    Manage
                </span>
            </div>
            <div className="mt-1 text-xs font-medium text-gray-500">
                {captionCount} caption files. {captionCount} subtitle files.
            </div>
        </div>
    );
}
