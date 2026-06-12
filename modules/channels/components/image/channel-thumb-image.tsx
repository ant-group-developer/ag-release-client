import ImageFallback from '@/components/ui/image/image-fallback';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Skeleton } from 'antd';

type Props = {
    thumbId?: string | null;
    name: string;
};

export default function ChannelThumbImage({ thumbId, name }: Props) {
    const { linkReadFile, isLoading } = useGetLinkReadFile(thumbId ?? '');
    const imageUrl = linkReadFile || getAvatarUrl(name);

    if (thumbId && isLoading) {
        return (
            <Skeleton.Node
                active
                style={{ width: 48, height: 48 }}
                className="!rounded-lg"
            />
        );
    }

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
