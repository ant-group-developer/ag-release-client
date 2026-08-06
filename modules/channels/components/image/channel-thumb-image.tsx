import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';

type Props = {
    thumbUrl?: string | null;
    name: string;
};

export default function ChannelThumbImage({ thumbUrl, name }: Props) {
    const imageUrl = thumbUrl;

    return (
        <ImageFallback
            src={imageUrl ?? FALLBACK_IMAGE}
            alt={name}
            width={48}
            height={48}
            className="aspect-square rounded-lg object-cover"
        />
    );
}
