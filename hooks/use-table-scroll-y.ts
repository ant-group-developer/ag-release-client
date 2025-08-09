import { SCREEN } from '@/enums/common';
import { useWindowSize } from '@uidotdev/usehooks';
import { useMemo } from 'react';
import { ClassInput, useElementHeightByClass } from './use-element-height';

interface Props {
    pageHeaderClassName?: ClassInput;
    pageTableHeaderClassName?: ClassInput;
    pagePaginationClassName?: ClassInput;
}

export const useTableScrollY = (props?: Props) => {
    const {
        pageHeaderClassName = 'app-header',
        pageTableHeaderClassName = 'ant-table-header',
        pagePaginationClassName = 'ant-pagination',
    } = props || {};

    const minHeight = 300;
    const appHeaderHeight = 64;

    const { height, width } = useWindowSize();

    const pageHeaderHeight = useElementHeightByClass(pageHeaderClassName) ?? 0;
    const pageTableHeaderHeight =
        useElementHeightByClass(pageTableHeaderClassName) ?? 0;
    const pagePaginationHeight =
        useElementHeightByClass(pagePaginationClassName) ?? 0;

    const scrollY = useMemo(() => {
        const isSmallDevice = Number(width) <= SCREEN.MD;
        if (!width || !height || isSmallDevice) return undefined;

        const value =
            height -
            appHeaderHeight -
            pageHeaderHeight -
            pageTableHeaderHeight -
            pagePaginationHeight;
        return value > minHeight ? value : minHeight;
    }, [
        width,
        height,
        pageHeaderHeight,
        pagePaginationHeight,
        pageTableHeaderHeight,
    ]);

    return scrollY;
};
