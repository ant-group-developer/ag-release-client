import { defaultData } from '@/constants/common';
import { ACCOUNT_TYPE } from '@/modules/user/enums';
import { useQuery } from '@tanstack/react-query';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { DataFilterTopic, TopicData, TopicDetailData } from '../types';

export const useTopicList = (params: DataFilterTopic, enabled?: boolean) => {
    const { data, ...restResponse } = useQuery({
        queryKey: [...topicQueryKeys.getList, params],
        queryFn: () => topicApi.getList(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        enabled: enabled ?? true,
    });

    const dataTopic: TopicData[] = data?.data?.data ?? defaultData.data;
    return {
        data: dataTopic,
        ...restResponse,
    };
};

export const useTopicListAll = () => {
    const { data, ...restResponse } = useQuery({
        queryKey: topicQueryKeys.getListAll,
        queryFn: () => topicApi.getListAll(),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const dataTopic: TopicData[] = data?.data?.data ?? defaultData.data;
    return {
        data: dataTopic,
        ...restResponse,
    };
};

export const useGetTopicDetail = (id: TopicDetailData['id']) => {
    const { data, ...restResponse } = useQuery({
        queryKey: [...topicQueryKeys.getDetail, id],
        queryFn: () => topicApi.getDetail(id),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const defaultData: TopicDetailData = {
        id: '',
        code: '',
        isActive: false,
        description: '',
        note: '',
        order: 0,
        children: [],
        illustrativeImage: undefined,
        imageIllustrativeId: null,
        imageIllustrative: {
            id: '',
            googleDriveFileId: null,
        },
        dateCreated: '',
        dateUpdated: '',
        googleDriveFolderId: null,
        creatorUser: {
            id: '',
            name: '',
            email: '',
            accountType: ACCOUNT_TYPE.USER,
            groups: [],
        },

        totalActiveChildren: 0,
        totalInactiveChildren: 0,
        topicAssignee: [],
    };
    const dataTopic: TopicDetailData = data?.data?.data ?? defaultData;

    return {
        dataTopic,
        ...restResponse,
    };
};
