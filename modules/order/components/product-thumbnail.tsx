import { Image, ImageProps } from 'antd';

interface Props extends ImageProps {
    src: string;
    className?: string;
}

export default function ProductThumbnail({ className, src, ...props }: Props) {
    return (
        <Image
            crossOrigin="anonymous"
            alt="Thumbnail"
            src={src}
            className={className}
            {...props}
        />
    );
}
