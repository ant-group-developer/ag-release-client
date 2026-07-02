import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DSP_TYPE } from '../enums';
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
        hasDeal: false,
        id: '',
        createdAt: '',
        updatedAt: null,
        formatLinks: [],
        dspActions: [],
        enablePolicy: false,
        code: '',
        isDefault: false,
        type: DSP_TYPE.AUDIO,
    };

    return {
        dspData: data?.data?.data ?? defaultData,
        ...res,
    };
};
