import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';

export const useGetListEnablePolicyDsp = () => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.list(),
        queryFn: () => dspApi.getListDspByEnablePolicy(),
        placeholderData: (prev) => prev,
    });

    const dspData = data?.data?.data ?? ([] as DspData[]);

    return {
        dspData,
        ...res,
    };
};
