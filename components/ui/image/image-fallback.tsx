import { FALLBACK_IMAGE } from '@/constants/common';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

export interface ImageFallbackProps extends Omit<ImageProps, 'src'> {
    src: ImageProps['src'];
    fallbackSrc?: ImageProps['src'];
}

function normalizeImageUrl(url?: string | StaticImport | null) {
    if (!url) return '';
    if (typeof url === 'string') {
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return '/' + url;
    }
    return url;
}

export default function ImageFallback({
    src,
    fallbackSrc = FALLBACK_IMAGE,
    ...rest
}: ImageFallbackProps): JSX.Element {
    const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src));

    useEffect(() => {
        setImgSrc(normalizeImageUrl(src));
    }, [src]);

    return (
        <Image
            {...rest}
            alt={rest.alt}
            src={imgSrc ? imgSrc : normalizeImageUrl(fallbackSrc)}
            onLoadingComplete={(result: {
                naturalWidth: number;
                naturalHeight: number;
            }) => {
                if (result.naturalWidth === 0) {
                    // Broken image: fall back to fallbackSrc.
                    setImgSrc(normalizeImageUrl(fallbackSrc));
                }
            }}
            onError={() => {
                setImgSrc(normalizeImageUrl(fallbackSrc));
            }}
        />
    );
}
