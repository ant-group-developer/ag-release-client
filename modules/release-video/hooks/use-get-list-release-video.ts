import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { releaseVideoApi } from '../apis';
import { releaseVideoQueryKeys } from '../constants/query-keys';
import { ReleaseVideoDataFilter } from '../types';

export const useGetListReleaseVideo = (params: ReleaseVideoDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: releaseVideoQueryKeys.list(params),
        queryFn: () => releaseVideoApi.getList(params),
        placeholderData: (prev) => prev,
    });

    const releaseVideoData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        releaseVideoData,
        lastUpdatedAt,
        ...res,
    };
};
