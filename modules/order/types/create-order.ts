import { CommonFunction, CreateFile } from '@/types/api';

export interface OrderPayload {
    topicId: string;
    // type: string;
    content: string;
    deadline: string;
    note: string;
    illustrativeImageList?: CreateFile[];
}

export interface CreateOrderPayload {
    dataOrder: OrderPayload;
    dataOrderProduct: {
        description?: string;
        productTypeId: string;
    }[];
}

export interface CreateOrder extends CommonFunction {
    payload: CreateOrderPayload;
}
