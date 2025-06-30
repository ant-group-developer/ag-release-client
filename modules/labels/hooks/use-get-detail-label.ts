import { useQuery } from '@tanstack/react-query';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelData } from '../types';

export const useGetDetailLabel = (id: LabelData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...labelsQueryKeys.getDetail, id],
        queryFn: () => labelsApi.getDetail(id),
    });

    const defaultData: LabelData = {
        picture: '',
        name: '',
        creatorId: '',
        modifierId: '',
        description: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        labelData: data?.data?.data ?? defaultData,
        ...res,
    };
};
