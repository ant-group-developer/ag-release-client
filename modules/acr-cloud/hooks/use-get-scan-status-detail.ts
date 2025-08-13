import { useQuery } from '@tanstack/react-query';
import { acrCloudApis } from '../apis';
import { acrCloudQueryKeys } from '../constants/query-keys';
import { TrackScanStatusData } from '../types';

export const useGetDetailScanStatus = (id: string) => {
    const { data, ...res } = useQuery({
        queryKey: acrCloudQueryKeys.getScanStatusDetail(id),
        queryFn: () => acrCloudApis.getDetailScanStatus(id),
        enabled: !!id,
    });

    return {
        scanStatusData: data?.data?.data ?? ({} as TrackScanStatusData),
        ...res,
    };
};
