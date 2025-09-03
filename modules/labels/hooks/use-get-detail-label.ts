import { useQuery } from '@tanstack/react-query';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelData } from '../types';

export const useGetDetailLabel = (id: LabelData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: labelsQueryKeys.detail(id),
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
        releaseCount: 0,
        trackCount: 0,
        tenantId: '',
        tenant: {
            id: '',
            name: '',
        },
        code: '',
    };

    return {
        labelData: data?.data?.data ?? defaultData,
        ...res,
    };
};
