import ImageFallback from '@/components/ui/image/image-fallback';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';

type Props = {
    thumbUrl?: string | null;
    name: string;
};

export default function ChannelThumbImage({ thumbUrl, name }: Props) {
    const imageUrl = thumbUrl || getAvatarUrl(name);

    return (
        <ImageFallback
            src={imageUrl}
            alt={name}
            width={48}
            height={48}
            className="aspect-square rounded-lg object-cover"
        />
    );
}
