import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';

export const useGetDetailDsp = (id: DspData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.detail(id),
        queryFn: () => dspApi.getDetail(id),
    });

    const defaultData: DspData = {
        creatorId: '',
        name: '',
        canLinkArtistProfile: false,
        id: '',
        createdAt: '',
        updatedAt: null,
        formatLinks: [],
    };

    return {
        dspData: data?.data?.data ?? defaultData,
        ...res,
    };
};
