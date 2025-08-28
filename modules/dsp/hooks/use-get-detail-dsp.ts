import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';

export const useGetDetailDsp = (id: DspData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.detail(id),
        queryFn: () => dspApi.getDetail(id),
        enabled: !!id,
    });

    const defaultData: DspData = {
        creatorId: '',
        name: '',
        isActive: false,
        id: '',
        createdAt: '',
        updatedAt: null,
        formatLinks: [],
        dspActions: [],
    };

    return {
        dspData: data?.data?.data ?? defaultData,
        ...res,
    };
};
