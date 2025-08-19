import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';
import { ReleaseTypesDataFilter } from '../types';

export const useGetListReleaseTypes = (
    params: ReleaseTypesDataFilter,
    options?: { enabled: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseTypesQueryKeys.list(params),
        queryFn: () => releaseTypesApi.getList(params),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const releaseTypesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        releaseTypesData,
        lastUpdatedAt,
        ...res,
    };
};
