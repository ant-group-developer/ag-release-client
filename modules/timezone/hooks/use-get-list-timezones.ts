import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { TimezoneDataFilter } from '../types';

export const useGetListTimezones = (params: TimezoneDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...timezoneQueryKeys.getList, params],
        queryFn: () => timezoneApi.getList(params),
    });

    const timezonesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        timezonesData,
        lastUpdatedAt,
        ...res,
    };
};
