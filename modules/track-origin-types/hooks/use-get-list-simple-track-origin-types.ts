import { useQuery } from '@tanstack/react-query';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';

export const useGetListSimpleTrackOriginTypes = () => {
    const { data, ...res } = useQuery({
        queryKey: trackOriginTypeQueryKeys.listsSimple(),
        queryFn: () => trackOriginTypeApi.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const trackOriginTypesData = data?.data?.data ?? [];

    return {
        trackOriginTypesData,
        ...res,
    };
};
