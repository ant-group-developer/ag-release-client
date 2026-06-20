import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { TrackData } from '../../types';

type Props = {
    trackData: TrackData;
    width?: number;
    height?: number;
};

export default function TrackCoverArt({ trackData, width = 40, height = 40 }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const imgFileId =
        trackData?.release?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S75] ??
        trackData?.release?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];

    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });

    const { linkReadFile } = useGetLinkReadFile(imgFileId as string, {
        enabled: !!entry?.isIntersecting,
    });

    useEffect(() => {
        if (imgFileId && linkReadFile) {
            setIsLoading(false);
        }
        if (!imgFileId) {
            const timeout = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [imgFileId, linkReadFile, isLoading]);

    if (isLoading) {
        return (
            <div ref={ref}>
                <Skeleton.Node
                    active
                    style={{ width, height }}
                    className="aspect-square !rounded-lg"
                />
            </div>
        );
    }

    return (
        <div ref={ref} className="flex-shrink-0 cursor-pointer">
            <ImageFallback
                fallbackSrc={FALLBACK_IMAGE}
                src={linkReadFile}
                alt="genre"
                width={width}
                height={height}
                className="aspect-square rounded-lg object-cover"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
}
