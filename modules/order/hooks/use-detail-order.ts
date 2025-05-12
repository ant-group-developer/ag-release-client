import { DetailResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { ORDER_STATUS, USED_STATUS } from '../enums';
import { OrderData } from '../types';

export const useGetDetailOrder = (id: OrderData['id'] | undefined) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getDetail, id],
        queryFn: () => orderApi.getDetail(id as OrderData['id']),
        refetchOnWindowFocus: true,
        enabled: Boolean(id),
    });

    const defaultData: OrderData = {
        id: '',
        content: '',
        orderIllustrative: [],
        illustrativeImage: undefined,
        code: '',
        note: '',
        deadline: '',
        userCreatorId: '',
        status: ORDER_STATUS.NEW,
        topicId: '',
        dateCreated: '',
        dateUpdated: '',
        topic: {
            id: '',
            code: '',
        },
        creatorUser: {
            id: '',
            name: '',
        },
        urlProduct: '',
        usedStatus: USED_STATUS.NOT_USED,
        googleDriveFolderId: null,
        nameUserCreator: '',
        priority: {
            id: '',
            nameVi: '',
            nameEn: '',
            color: '',
            order_count: 0,
            note: '',
        },
        approverUser: {
            id: '',
            name: '',
        },
    };

    const dataOrder: DetailResponse<OrderData>['data'] =
        data?.data?.data ?? defaultData;

    return {
        data: dataOrder,
        ...res,
    };
};
