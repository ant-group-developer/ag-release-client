import { SCREEN } from '@/enums/common';
import { useWindowSize } from '@uidotdev/usehooks';
import { useMemo } from 'react';
import { ClassInput, useElementHeightByClass } from './use-element-height';

interface Props {
    pageHeaderClassName?: ClassInput;
    pageTableHeaderClassName?: ClassInput;
    pagePaginationClassName?: ClassInput;
    skipTableHeader?: boolean;
    pagePadding?: number;
}

export const useTableScrollY = (props?: Props) => {
    const {
        pageHeaderClassName = 'app-header',
        pageTableHeaderClassName = 'ant-table-header',
        pagePaginationClassName = 'ant-pagination',
        skipTableHeader = false,
        pagePadding = 0,
    } = props || {};

    const minHeight = 300;
    const appHeaderHeight = 64;

    const { height, width } = useWindowSize();

    const pageHeaderHeight = useElementHeightByClass(pageHeaderClassName) ?? 0;
    const rawPageTableHeaderHeight =
        useElementHeightByClass(pageTableHeaderClassName) ?? 0;
    // Chỉ sử dụng height nếu không skip
    const pageTableHeaderHeight = skipTableHeader
        ? 0
        : rawPageTableHeaderHeight;
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
            pagePaginationHeight -
            pagePadding;
        return value > minHeight ? value : minHeight;
    }, [
        width,
        height,
        pageHeaderHeight,
        pagePaginationHeight,
        pageTableHeaderHeight,
        pagePadding,
    ]);

    return scrollY;
};
