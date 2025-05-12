import axiosAuth from '@/api/axios-auth';
import { DataFilterOrder } from '@/modules/order/types';
import { ListResponse, PaginationResponse } from '@/types/api';
import { CreateProductTypePayload } from '../hooks/use-create-product-type';
import { UpdateProductTypePayload } from '../hooks/use-update-product-type';
import { UpdateProductTypeOrderPayload } from '../hooks/use-update-product-type-order';
import { ProductCountData, ProductTypeData } from '../types';

export const productTypesApis = {
    getList: () => {
        return axiosAuth.get<PaginationResponse<ProductTypeData>>(
            '/product-types'
        );
    },

    getCountProductTypes: (params?: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<ProductCountData>>(
            '/orders/sidebar/type',
            { params }
        );
    },

    createProductType: (payload: CreateProductTypePayload) => {
        return axiosAuth.post<CreateProductTypePayload>(
            '/product-types',
            payload
        );
    },

    deleteProductType: (productTypeId: string) => {
        return axiosAuth.delete(`/product-types/${productTypeId}`);
    },

    updateProductTypeOrder: (payload: UpdateProductTypeOrderPayload) => {
        return axiosAuth.patch('/product-types/update-order', payload);
    },

    updateProductType: (
        id: ProductTypeData['id'],
        payload: UpdateProductTypePayload
    ) => {
        return axiosAuth.patch(`/product-types/${id}`, payload);
    },
};
