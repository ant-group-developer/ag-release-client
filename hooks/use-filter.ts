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

export type UseFilterOptions = {
    /**
     * Namespaces every query param this instance reads and writes, so filters
     * of a modal and of the page underneath it can coexist in one URL.
     */
    paramPrefix?: string;
    history?: 'push' | 'replace';
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

const serializeQueryParamValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const hasObjectItem = value.some(
            (item) => item && typeof item === 'object'
        );

        return hasObjectItem ? JSON.stringify(value) : value.join(',');
    }

    if (value && typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
};

export const useFilter = <DataFilterType extends CommonParams>(
    defaultFilter: DataFilterType,
    options?: UseFilterOptions
): UseFilterProps<DataFilterType> => {
    const pathname = usePathname();
    const prefix = options?.paramPrefix ?? '';
    const historyMode = options?.history ?? 'push';

    const searchParams = useSearchParams();
    const queryParams = useQueryParams();
    const router = useRouter();

    const scopedQueryParams = prefix
        ? Object.fromEntries(
              Object.entries(queryParams)
                  .filter(([key]) => key.startsWith(prefix))
                  .map(([key, value]) => [key.slice(prefix.length), value])
          )
        : queryParams;

    const dataFilter: DataFilterType = {
        ...defaultFilter,
        ...scopedQueryParams,
    };

    const syncParamsToURL = (params: any) => {
        const current = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );
        for (const [key, value] of Object.entries(params)) {
            const paramKey = `${prefix}${key}`;
            if (value) {
                current.set(paramKey, serializeQueryParamValue(value));
            } else {
                current.delete(paramKey);
            }
        }

        const url = `${pathname}?${current.toString()}`;
        if (historyMode === 'replace') {
            router.replace(url);
            return;
        }

        router.push(url);
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
        if (!prefix) {
            window.history.pushState(null, '', pathname ?? '');
            return;
        }

        const current = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );
        Array.from(current.keys())
            .filter((key) => key.startsWith(prefix))
            .forEach((key) => current.delete(key));

        window.history.pushState(
            null,
            '',
            `${pathname}?${current.toString()}`
        );
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
