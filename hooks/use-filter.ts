'use client';

import { AppSearchProps, OnSearchType } from '@/components/ui/input/search';
import { PAGE_SIZE } from '@/constants/page-size';
import { CommonParams } from '@/types/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryParams } from './use-query-params';

export type OnChangeFilter<DataFilterType> = (
    newValue: Partial<DataFilterType>,
    backToFirstPage?: boolean
) => void;

export type OnChangePage = (page: number, pageSize: number) => void;

export type RemoveFilter = () => void;

export type TOnSearch = {
    backToFirstPage?: boolean;
} & OnSearchType;

export type UseFilterProps<DataFilterType> = {
    dataFilter: DataFilterType;
    canClearFilter: boolean;
    isReady: boolean;
    onSearch: TOnSearch;
    onChangeFilter: OnChangeFilter<DataFilterType>;
    onChangePage: OnChangePage;
    removeFilter: RemoveFilter;
    defaultFilter: DataFilterType;
};

const compareObjects = (obj1: any, obj2: any) => {
    // const customize = (objValue: any, othValue: any) => {
    //     if (objValue == othValue) {
    //         return true;
    //     }
    // };

    // return isEqualWith(obj1, obj2, customize);

    const keysA = Object.keys(obj1);
    const keysB = Object.keys(obj2);

    // Kiểm tra nếu số lượng keys không bằng nhau
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Kiểm tra nếu tất cả keys trong object A có trong object B và ngược lại
    for (const key of keysA) {
        if (!keysB.includes(key)) {
            return false;
        }
    }

    // So sánh giá trị của từng key, chuyển đổi kiểu dữ liệu nếu cần
    for (const key of keysA) {
        if (String(obj1[key]) !== String(obj2[key])) {
            return false;
        }
    }

    return true;
};

export const useFilter = <DataFilterType extends CommonParams>(
    defaultFilter: DataFilterType
): UseFilterProps<DataFilterType> => {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const queryParams = useQueryParams();

    const dataFilter: DataFilterType = {
        ...defaultFilter,
        ...queryParams,
    };

    const syncParamsToURL = (params: any) => {
        const current = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );
        for (const [key, value] of Object.entries(params)) {
            if (value) {
                current.set(key, value as string);
            } else {
                current.delete(key);
            }
        }

        router.push(`${pathname}?${current.toString()}`);
    };

    const onChangePage: OnChangePage = (page, pageSize = PAGE_SIZE) => {
        syncParamsToURL({
            page,
            pageSize: pageSize,
        });
    };

    const onSearch: AppSearchProps['onChange'] = (e) => {
        const keyword = e.target.value?.trim();
        syncParamsToURL({
            keyword,
            page: defaultFilter.page,
        });
    };

    const onChangeFilter: OnChangeFilter<DataFilterType> = (
        newValue,
        backToFirstPage = true
    ) => {
        const pageParams = backToFirstPage
            ? {
                  page: defaultFilter.page,
              }
            : {};

        syncParamsToURL({
            ...pageParams,
            ...newValue,
        });
    };

    const removeNullValue = (filter: DataFilterType) => {
        for (const key in filter) {
            if (!filter[key] && filter[key] !== 0) {
                delete filter[key];
            }
        }
    };

    const convertToNumber = (filter: DataFilterType) => {
        if (filter.page) {
            filter.page = Number(filter.page);
        }
        if (filter.pageSize) {
            filter.pageSize = Number(filter.pageSize);
        }
    };

    const removeFilter = () => {
        router.push(pathname ?? '');
    };

    removeNullValue(dataFilter);
    convertToNumber(dataFilter);

    const isSameValue = compareObjects(dataFilter, defaultFilter);

    return {
        isReady: true,
        // isReady: router.isReady,
        canClearFilter: !isSameValue,
        dataFilter,
        onChangeFilter,
        onChangePage,
        onSearch,
        removeFilter,
        defaultFilter,
    };
};
