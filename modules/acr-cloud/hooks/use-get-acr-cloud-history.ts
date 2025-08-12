import { useQuery } from '@tanstack/react-query';
import { acrCloudApis } from '../apis';
import { acrCloudQueryKeys } from '../constants/query-keys';
import { TrackScanHistoryData } from '../types';

export const useGetAcrCloudHistory = (trackId: string) => {
    const { data, ...res } = useQuery({
        queryKey: acrCloudQueryKeys.getDetail(trackId),
        queryFn: () => acrCloudApis.getScanResult(trackId),
        enabled: !!trackId,
    });

    return {
        acrCloudResult: data?.data?.data ?? ([] as TrackScanHistoryData[]),
        ...res,
    };
};
