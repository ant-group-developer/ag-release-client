import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function ReleaseCoverImage({ data }: Props) {
    const [loaded, setLoaded] = useState(false);
    const imgFileId =
        data?.coverArtThumbnails?.['75x75'] ??
        data?.coverArtThumbnails?.original;

    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });

    const { linkReadFile, isFetching } = useGetLinkReadFile(
        imgFileId as string,
        {
            enabled: !!entry?.isIntersecting,
        }
    );

    const showSkeleton = isFetching;

    useEffect(() => {
        if (linkReadFile) {
            setLoaded(false);
        }
    }, [linkReadFile]);

    return (
        <div ref={ref}>
            {/* Skeleton */}
            {showSkeleton && (
                <Skeleton.Node
                    active
                    className="aspect-square !h-10 !w-10 !rounded-lg"
                />
            )}

            {/* Image */}
            {!showSkeleton && (
                <ImageFallback
                    fallbackSrc={FALLBACK_IMAGE}
                    src={linkReadFile}
                    alt="cover"
                    width={40}
                    height={40}
                    className={`aspect-square rounded-lg object-cover transition-opacity duration-300 ${
                        loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                />
            )}
        </div>
    );
}
