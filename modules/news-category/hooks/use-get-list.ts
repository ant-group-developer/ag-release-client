import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';
import { NewsCategoryData, NewsCategoryDataFilter } from '../types';

export const useGetListNewsCategory = (
    params: NewsCategoryDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: newsCategoryQueryKeys.list(params),
        queryFn: () => newsCategoryApis.getList(params),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const newsCategoryData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<NewsCategoryData>['data']);

    return {
        newsCategoryData,
        ...res,
    };
};
