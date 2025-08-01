import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function ReleaseCoverImage({ data }: Props) {
    const imgSource =
        data?.coverArtThumbnails?.['75x75'] ??
        data?.coverArtThumbnails?.original;
    return (
        <ImageFallback
            fallbackSrc={FALLBACK_IMAGE}
            src={imgSource as string}
            alt="cover"
            width={40}
            height={40}
            className="aspect-square rounded-lg object-cover"
        />
    );
}
