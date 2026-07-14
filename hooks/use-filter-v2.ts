import { AppSearchProps } from '@/components/ui/input/search';
import {
    useQueryStates,
    UseQueryStatesKeysMap,
    UseQueryStatesOptions,
    Values,
} from 'nuqs';
import { useMemo } from 'react';

export interface UseFilterProps<FilterValues> {
    dataFilter: FilterValues;
    onChangePage: (page: number, pageSize: number) => void;
    onSearch: AppSearchProps['onChange'];
    onChangeFilter: (newValues: FilterValues, backToFirst?: boolean) => void;
    resetFilterValues: () => void;
    canClearFilter: boolean;
    defaultFilter: FilterValues;
}

export function useFilterV2<
    FilterValues,
    KeyMap extends UseQueryStatesKeysMap = UseQueryStatesKeysMap,
>(
    keyMap: KeyMap,
    options?: Partial<UseQueryStatesOptions<KeyMap>>
    // @ts-ignore
): UseFilterProps<FilterValues> {
    const [filterValues, setFilterValues] = useQueryStates(keyMap, {
        history: 'replace',
        ...options,
    });

    const dataFilter = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(filterValues).filter(
                    ([, value]) => value !== null && value !== undefined
                )
            ) as FilterValues,
        [filterValues]
    );

    const defaultFilter = useMemo(() => {
        return Object.fromEntries(
            Object.entries(keyMap).map(([key, parser]) => [
                key,
                (parser as any)?.defaultValue,
            ])
        ) as FilterValues;
    }, [keyMap]);

    const onChangePage = (page: number, pageSize: number) => {
        setFilterValues({ page, pageSize } as Values<KeyMap>);
    };

    const onSearch: AppSearchProps['onChange'] = (e) => {
        const keyword = e.target.value.trim();
        setFilterValues({ keyword, page: 1 } as Values<KeyMap>);
    };

    const onChangeFilter = (
        newValues: Partial<FilterValues>,
        backToFirst = true
    ) => {
        const sanitized = Object.fromEntries(
            Object.entries(newValues as {}).map(([key, value]) => [
                key,
                value === undefined ? null : value,
            ])
        ) as Values<KeyMap>;

        setFilterValues({
            ...(backToFirst && { page: 1 }),
            ...sanitized,
        });
    };

    const resetFilterValues = () => {
        setFilterValues(null);
    };

    const canClearFilter = useMemo(
        () =>
            Object.entries(filterValues).some(([key, value]) => {
                if (value === null || value === undefined) {
                    return false;
                }

                const defaultValue = keyMap[key]?.defaultValue;

                return defaultValue === undefined || value !== defaultValue;
            }),
        [filterValues, keyMap]
    );

    return {
        dataFilter,
        onChangePage,
        onSearch,
        onChangeFilter,
        resetFilterValues,
        canClearFilter,
        defaultFilter,
    };
}
