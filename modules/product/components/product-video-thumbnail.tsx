import ImageFallback, {
    ImageFallbackProps,
} from '@/components/ui/image/image-fallback';
import { useGetThumbnail } from '@/modules/google-drive/hooks/use-get-thumbnail';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { ImageProps } from 'antd';

type Props = Omit<ImageFallbackProps, 'src'> & {
    googleDriveFileId: string;
    fallbackSrc?: ImageProps['src'];
};

export default function ProductVideoThumbnail({
    googleDriveFileId,
    fallbackSrc,
    ...props
}: Props) {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: null,
        rootMargin: '0px',
    });

    const { thumbnailData } = useGetThumbnail(
        googleDriveFileId,
        !!entry?.isIntersecting
    );

    const resizedUrl = thumbnailData.replace(/=s\d+/, `=w${props?.width}`);

    return (
        <div ref={ref} className="h-full">
            <ImageFallback
                className="aspect-video max-h-20 cursor-pointer rounded-lg object-cover"
                src={resizedUrl ?? fallbackSrc}
                fallbackSrc={fallbackSrc}
                height={80}
                width={150}
                {...props}
                alt={googleDriveFileId}
            />
        </div>
    );
}
