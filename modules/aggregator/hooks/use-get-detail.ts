import { useQuery } from '@tanstack/react-query';

import { aggregatorApis } from '../apis';
import { aggregatorQueryKeys } from '../constants/query-keys';
import { AggregatorData } from '../types';

export const useGetDetailAggregator = (id: AggregatorData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: aggregatorQueryKeys.detail(id),
        queryFn: () => aggregatorApis.getDetail(id),
        placeholderData: (prev) => prev,
        enabled: !!id,
    });

    const defaultData: AggregatorData = {
        creatorId: '',
        creator: {
            id: '',
            name: null,
            email: '',
        },
        modifierId: '',
        code: '',
        name: '',
        contactEmail: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        isActive: false,
        isDefault: false,
        sftpConfig: {
            id: '',
            metadata: {
                host: '',
                port: 0,
                username: '',
                password: '',
                path: '',
            },
        },
        ddexId: '',
        ddexName: '',
        createsDoneFolder: false,
        deliveryEmail: '',
        deliveryEmailSubject: '',
        manualUploadUrl: '',
    };

    return {
        aggregatorData: data?.data?.data ?? defaultData,
        ...res,
    };
};
