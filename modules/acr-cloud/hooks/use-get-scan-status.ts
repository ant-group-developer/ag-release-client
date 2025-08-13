import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { acrCloudApis } from '../apis';
import { acrCloudQueryKeys } from '../constants/query-keys';
import { TrackScanStatusData, TrackScanStatusDataFilter } from '../types';

export const useGetScanStatus = (params: TrackScanStatusDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: acrCloudQueryKeys.getScanStatusList(params),
        queryFn: () => acrCloudApis.getScanStatus(params),
    });

    return {
        scanStatusData:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<TrackScanStatusData>['data']),
        ...res,
    };
};
