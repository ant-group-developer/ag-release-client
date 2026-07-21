import ImageFallback from '@/components/ui/image/image-fallback';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
    data?: ReleasesData;
    fileId?: string;
    src?: string | null;
    width?: number;
    height?: number;
    className?: string;
};

export default function ReleaseVideoCoverImage({
    data,
    fileId,
    src,
    width,
    height,
    className,
}: Props) {
    const imgWidth = width ?? 100;
    const imgHeight = height ?? Math.round((imgWidth * 9) / 16);

    const [isLoading, setIsLoading] = useState(!src);
    const imgFileId =
        fileId ??
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
            <div
                ref={ref}
                className={`flex flex-shrink-0 items-center justify-center ${className || ''}`}
            >
                <Skeleton.Node
                    active
                    style={{ width: imgWidth, height: imgHeight }}
                    className="aspect-[16/9] !rounded-lg"
                />
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`flex flex-shrink-0 items-center justify-center ${className || ''}`}
        >
            <ImageFallback
                src={coverSrc ?? ''}
                alt="cover"
                width={imgWidth}
                height={imgHeight}
                className={`aspect-[16/9] rounded-lg object-cover transition-opacity duration-300`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
}
