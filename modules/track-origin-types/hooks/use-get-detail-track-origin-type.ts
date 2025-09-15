import { useQuery } from '@tanstack/react-query';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeData } from '../types';

export const useGetDetailTrackOriginType = (id: TrackOriginTypeData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: trackOriginTypeQueryKeys.detail(id),
        queryFn: () => trackOriginTypeApi.getDetail(id),
    });

    const defaultData: TrackOriginTypeData = {
        name: '',
        creatorId: '',
        modifierId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        code: '',
        isDefault: false,
    };

    return {
        trackOriginTypeData: data?.data?.data ?? defaultData,
        ...res,
    };
};
