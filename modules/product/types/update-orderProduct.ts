import { CommonFunction } from '@/types/api';

export interface UpdateOrderProductPayload {
    rate: number;
}

export interface UpdateOrderProduct extends CommonFunction {
    orderProductId: string;
    payload: UpdateOrderProductPayload;
}
