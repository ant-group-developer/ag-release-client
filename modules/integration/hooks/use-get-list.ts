import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { integrationApis } from '../apis';
import { integrationQueryKeys } from '../constants';
import { IntegrationData, IntegrationDataFilter } from '../types';

export const useGetListIntegration = (params: IntegrationDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: integrationQueryKeys.list(params),
        queryFn: () => integrationApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const integrationsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<IntegrationData>['data']);

    return {
        integrationsData,
        ...res,
    };
};
