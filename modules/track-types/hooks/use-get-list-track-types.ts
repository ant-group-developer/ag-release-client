import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { TrackTypeDataFilter } from '../types';

export const useGetListTrackTypes = (params: TrackTypeDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...trackTypeQueryKeys.getList, params],
        queryFn: () => trackTypeApi.getList(params),
    });

    const trackTypesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE
    );

    return {
        trackTypesData,
        lastUpdatedAt,
        ...res,
    };
};
