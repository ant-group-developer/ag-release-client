import { CommonFunction } from '@/types/api';
import { OrderData } from '.';

export interface DeleteOrder extends CommonFunction {
    orderId: OrderData['id'];
}
