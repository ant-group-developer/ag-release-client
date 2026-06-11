import { useQuery } from '@tanstack/react-query';
import { pgDspsSyncApi } from '../apis';
import { pgDspsSyncQueryKeys } from '../constants/query-keys';
import { PgDspsSyncDataFilter } from '../types';

export const useGetListPgDspsSync = (params: PgDspsSyncDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: pgDspsSyncQueryKeys.list(params),
        queryFn: () => pgDspsSyncApi.getList(params),
    });

    const pgDspsSyncData = data?.data?.data?.items ?? [];

    return {
        pgDspsSyncData,
        ...res,
    };
};
