import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData, DspRoutingConfig } from '../types';

export const useGetDspRoutingConfig = (id: DspData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.detailRoutingConfig(id),
        queryFn: () => dspApi.getDspRoutingConfig(id),
        enabled: !!id,
    });

    const defaultData: DspRoutingConfig = {
        dspId: '',
        mode: null,
        sftpConfig: {
            metadata: {
                host: '',
                port: 0,
                username: '',
                password: '',
                path: '',
            },
        },
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        dspRoutingConfig: data?.data?.data ?? defaultData,
        ...res,
    };
};
