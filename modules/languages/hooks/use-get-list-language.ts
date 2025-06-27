import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguageDataFilter, LanguagesData } from '../types';

export const useGetListLanguage = (params: LanguageDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [languageQueryKeys.getList, params],
        queryFn: () => languageApi.getList(params),
        refetchOnWindowFocus: false,
    });

    const languagesData: PaginationResponse<LanguagesData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        languagesData: languagesData,
        ...res,
    };
};
