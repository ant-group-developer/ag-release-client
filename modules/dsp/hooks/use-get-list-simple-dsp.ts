import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';

export const useGetListDspSimple = (options?: { enabled: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.lists(),
        queryFn: () => dspApi.getListSimple(),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const dspData = data?.data?.data ?? ([] as DspData[]);

    return {
        dspData,
        ...res,
    };
};
