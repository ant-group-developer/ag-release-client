import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeDataFilter } from '../types';

export const useGetListTrackOriginTypes = (
    params: TrackOriginTypeDataFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: trackOriginTypeQueryKeys.list(params),
        queryFn: () => trackOriginTypeApi.getList(params),
    });

    const trackOriginTypesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        trackOriginTypesData,
        lastUpdatedAt,
        ...res,
    };
};
