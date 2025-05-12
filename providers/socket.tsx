'use client';

import { useOrderUpdateStore } from '@/hooks/use-order-store';
import { useProductUpdateStore } from '@/hooks/use-product-store';
import { useQueryClient } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

interface props extends PropsWithChildren {
    accessToken?: string;
}

enum EMIT_NAME {
    NEW_ORDER = 'newOrder',
    UPDATE_ORDER = 'updateOrder',
    DELETE_ORDER = 'deleteOrder',
    ASSIGN_TASK = 'assignTask',
    REMOVE_ASSIGNEE_TASK = 'removeAssignee',
    NEW_ORDER_PRODUCT = 'newOrderProduct',
    NEW_REVIEW = 'newReview',
}

function SocketProvider({ children, accessToken }: props) {
    const queryClient = useQueryClient();
    const setOrderHasNewData = useOrderUpdateStore(
        (state) => state.setHasNewData
    );
    const setProductHasNewData = useProductUpdateStore(
        (state) => state.setHasNewData
    );
    // const { profile } = useAuth();
    // console.log('🚀 ~ SocketProvider ~ profile:', profile);

    // useEffect(() => {
    //     // @ts-ignore
    //     const socket = io.connect(`${process.env.API_URL}/notifications`, {
    //         auth: {
    //             accessToken,
    //         },
    //     });

    //     socket.on('connect', () => {
    //         console.log('Socket đã kết nối thành công!');
    //     });

    //     socket.on('connect_error', (error: Error) => {
    //         console.error('Lỗi kết nối socket:', error);
    //     });

    //     socket.on('disconnect', (reason: string) => {
    //         console.log('Socket đã ngắt kết nối:', reason);
    //     });

    //     const orderListener = () => {
    //         setOrderHasNewData(true);
    //     };

    //     const productListener = () => {
    //         setProductHasNewData(true);
    //     };

    //     const reviewListener = () => {
    //         alert('new review');
    //         queryClient.invalidateQueries({
    //             queryKey: commentRatingQueryKeys.getDetail,
    //         });
    //     };

    //     // order page action
    //     socket.on(EMIT_NAME.NEW_ORDER, orderListener);
    //     socket.on(EMIT_NAME.DELETE_ORDER, orderListener);
    //     socket.on(EMIT_NAME.UPDATE_ORDER, orderListener);

    //     // product page action
    //     socket.on(EMIT_NAME.NEW_ORDER_PRODUCT, productListener);
    //     socket.on(EMIT_NAME.ASSIGN_TASK, productListener);
    //     socket.on(EMIT_NAME.REMOVE_ASSIGNEE_TASK, productListener);

    //     // review
    //     socket.on(EMIT_NAME.NEW_REVIEW, reviewListener);

    //     return () => {
    //         socket.removeAllListeners();
    //         socket.disconnect();
    //     };
    // }, []);

    return <React.Fragment>{children}</React.Fragment>;
}

export default SocketProvider;
