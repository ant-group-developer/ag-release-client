import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { TrackData } from '../../types';

type Props = {
    trackData: TrackData;
};

export default function TrackCoverArt({ trackData }: Props) {
    const imgFileId =
        trackData?.release?.coverArtThumbnails?.['75x75'] ??
        trackData?.release?.coverArtThumbnails?.original;

    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });

    const { linkReadFile } = useGetLinkReadFile(imgFileId as string, {
        enabled: !!entry?.isIntersecting,
    });
    return (
        <div ref={ref} className="flex-shrink-0 cursor-pointer">
            <ImageFallback
                fallbackSrc={FALLBACK_IMAGE}
                src={linkReadFile}
                alt="genre"
                width={40}
                height={40}
                className="aspect-square rounded-lg object-cover"
            />
        </div>
    );
}
