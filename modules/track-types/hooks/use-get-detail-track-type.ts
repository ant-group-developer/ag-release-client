import { useQuery } from '@tanstack/react-query';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { TrackTypeData } from '../types';

export const useGetDetailTrackType = (id: TrackTypeData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: trackTypeQueryKeys.detail(id),
        queryFn: () => trackTypeApi.getDetail(id),
    });

    const defaultData: TrackTypeData = {
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
        trackTypeData: data?.data?.data ?? defaultData,
        ...res,
    };
};
