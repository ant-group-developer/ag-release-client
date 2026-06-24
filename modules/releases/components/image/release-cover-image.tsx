import ImageFallback from '@/components/ui/image/image-fallback';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { RELEASE_COVER_ART_SIZE } from '../../constants';
import { ReleasesData } from '../../types';

type Props = {
    data?: ReleasesData;
    fileId?: string;
    src?: string | null;
    width?: number;
    height?: number;
};

export default function ReleaseCoverImage({
    data,
    fileId,
    src,
    width = 56,
    height = 56,
}: Props) {
    const [isLoading, setIsLoading] = useState(!src);
    const imgFileId =
        fileId ??
        data?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S75] ??
        data?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];
    const imageSrc = src || undefined;

    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });

    const { linkReadFile } = useGetLinkReadFile(imgFileId as string, {
        enabled: !imageSrc && !!imgFileId && !!entry?.isIntersecting,
    });
    const coverSrc = imageSrc ?? linkReadFile;

    useEffect(() => {
        if (coverSrc) {
            setIsLoading(false);
        }
        if (!imgFileId && !imageSrc) {
            const timeout = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [coverSrc, imageSrc, imgFileId]);

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
        <div ref={ref}>
            <ImageFallback
                src={coverSrc ?? ''}
                alt="cover"
                width={width}
                height={height}
                className={`aspect-square rounded-lg object-cover transition-opacity duration-300`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
}
