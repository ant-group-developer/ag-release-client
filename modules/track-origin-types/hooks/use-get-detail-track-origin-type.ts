import { useQuery } from '@tanstack/react-query';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeData } from '../types';

export const useGetDetailTrackOriginType = (id: TrackOriginTypeData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...trackOriginTypeQueryKeys.getDetail, id],
        queryFn: () => trackOriginTypeApi.getDetail(id),
    });

    const defaultData: TrackOriginTypeData = {
        name: '',
        creatorId: '',
        modifierId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        value: '',
    };

    return {
        trackOriginTypeData: data?.data?.data ?? defaultData,
        ...res,
    };
};
