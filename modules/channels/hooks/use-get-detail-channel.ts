import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelsData } from '../types';

export const useGetDetailChannel = (id: ChannelsData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.detail(id),
        queryFn: () => channelApi.getDetail(id),
    });

    const defaultData: ChannelsData = {
        name: '',
        tenantId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        channelData: data?.data?.data ?? defaultData,
        ...res,
    };
};
