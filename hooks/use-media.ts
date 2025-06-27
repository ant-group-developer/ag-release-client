'use client';
import { useMediaQuery as useMedia } from '@uidotdev/usehooks';

export const useMediaQuery = () => {
    const isSmallDevice = useMedia('only screen and (max-width : 768px)');
    const isLargeDevice = useMedia('only screen and (min-width : 1280px)');
    return {
        isSmallDevice,
        isLargeDevice,
    };
};
