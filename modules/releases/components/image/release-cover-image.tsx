import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function ReleaseCoverImage({ data }: Props) {
    const imgFileId =
        data?.coverArtThumbnails?.['75x75'] ??
        data?.coverArtThumbnails?.original;

    const { linkReadFile } = useGetLinkReadFile(imgFileId as string);

    return (
        <ImageFallback
            fallbackSrc={FALLBACK_IMAGE}
            src={linkReadFile as string}
            alt="cover"
            width={40}
            height={40}
            className="aspect-square rounded-lg object-cover"
        />
    );
}
