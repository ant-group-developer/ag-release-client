import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData, NewsDataFilter } from '../types';

export const useGetListNews = (params: NewsDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.list(params),
        queryFn: () => newsApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const newsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<NewsData>['data']);

    return {
        newsData,
        ...res,
    };
};
