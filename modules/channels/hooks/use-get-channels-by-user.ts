import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { UserChannelData } from '../types';

export const useGetChannelsByUser = (userId: string) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.userChannels(userId),
        queryFn: () => channelApi.getChannelsByUserId(userId),
        enabled: Boolean(userId),
        refetchOnWindowFocus: false,
    });

    const userChannelsData: UserChannelData[] = data?.data?.data ?? [];

    return {
        userChannelsData,
        channelsData: userChannelsData,
        ...res,
    };
};
