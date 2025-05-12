import { FALLBACK_IMAGE } from '@/constants/common';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

export interface ImageFallbackProps extends Omit<ImageProps, 'src'> {
    src: ImageProps['src'];
    fallbackSrc?: ImageProps['src'];
}

export default function ImageFallback({
    src,
    fallbackSrc = FALLBACK_IMAGE,
    ...rest
}: ImageFallbackProps): JSX.Element {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            alt={rest.alt}
            src={imgSrc}
            onLoadingComplete={(result: {
                naturalWidth: number;
                naturalHeight: number;
            }) => {
                if (result.naturalWidth === 0) {
                    // Broken image: fall back to fallbackSrc.
                    setImgSrc(fallbackSrc);
                }
            }}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
