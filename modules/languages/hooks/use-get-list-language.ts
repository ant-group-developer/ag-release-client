import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguageDataFilter, LanguagesData } from '../types';

export const useGetListLanguage = (params: LanguageDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...languageQueryKeys.getList, params],
        queryFn: () => languageApi.getList(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const languagesData: PaginationResponse<LanguagesData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        languagesData: languagesData,
        lastUpdatedAt,
        ...res,
    };
};
