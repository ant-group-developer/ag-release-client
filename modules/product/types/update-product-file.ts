import { OrderProduct } from '@/modules/order/types';
import { CommonFunction, CreateFile } from '@/types/api';
import { CreateProduct } from './create-product';

export interface SubmitProductFile {
    note?: OrderProduct['note'];
    product: CreateProduct;
    file?: CreateFile;
}

export interface SubmitProductFilePayload extends CommonFunction {
    orderProductId: OrderProduct['id'];
    payload: SubmitProductFile;
}
