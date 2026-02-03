import { useQuery } from '@tanstack/react-query';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';

export const useGetListSimpleTrackTypes = () => {
    const { data, ...res } = useQuery({
        queryKey: trackTypeQueryKeys.listsSimple(),
        queryFn: () => trackTypeApi.getListSimple(),
    });

    const trackTypesData = data?.data?.data ?? [];

    return {
        trackTypesData,
        ...res,
    };
};
