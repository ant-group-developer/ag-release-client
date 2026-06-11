import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';

export const useGetListSimpleChannel = () => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.listsSimple(),
        queryFn: () => channelApi.getListSimple(),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const channelsData = data?.data?.data ?? [];

    return {
        channelsData: channelsData,
        ...res,
    };
};
