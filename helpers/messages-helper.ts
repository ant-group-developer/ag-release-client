import { message } from 'antd';
import type { Id, ToastOptions, TypeOptions } from 'react-toastify';

// Ant Design message không có concept "toastId" như react-toastify,
// nhưng ta có thể dùng message.open với key để mô phỏng behavior tương tự.

// Map type của react-toastify sang method của antd message
const typeMap: Record<
    string,
    'success' | 'error' | 'warning' | 'info' | 'loading'
> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    warn: 'warning',
    info: 'info',
    default: 'info',
};

export const showNotification = (
    type: TypeOptions,
    msg: string,
    toastOptions?: ToastOptions
) => {
    const duration = toastOptions?.autoClose
        ? (toastOptions.autoClose as number) / 1000
        : 4;

    const antdType = typeMap[type] ?? 'info';
    const key = (toastOptions?.toastId as string) ?? msg ?? 'notification';

    message.open({
        type: antdType,
        content: msg,
        duration,
        key,
    });
};

export const hideNotification = (toastId: ToastOptions['toastId']) => {
    if (toastId !== undefined) {
        message.destroy(toastId as string);
    }
};

export const isToastActive = (toastId: ToastOptions['toastId']): boolean => {
    // Ant Design message không hỗ trợ check active theo key
    // Trả về false để tránh crash — điều chỉnh logic nếu cần
    if (toastId === undefined) return false;
    return false;
};

// Loading notification — trả về key thay vì Id của toastify
export const showNotificationLoading = (msg?: string): Id => {
    const key = `loading-${Date.now()}`;
    message.open({
        type: 'loading',
        content: msg ?? 'Loading, please wait a few seconds',
        duration: 0, // không tự đóng
        key,
    });
    return key;
};

export const notificationSuccess = (id: Id, msg?: string) => {
    message.open({
        key: id as string,
        type: 'success',
        content: msg ?? 'Completed',
        duration: 4,
    });
};

export const notificationError = (id: Id, msg?: string) => {
    message.open({
        key: id as string,
        type: 'error',
        content: msg ?? 'Failure',
        duration: 4,
    });
};

export const toastPromise = <T>(
    promise: Promise<T>,
    messages: (key: any) => any,
    options?: {
        pending?: string;
        success?: string;
        error?: string;
    }
): Promise<T> => {
    const key = `promise-${Date.now()}`;

    message.open({
        key,
        type: 'loading',
        content: options?.pending ?? messages('common.processing'),
        duration: 0,
    });

    return promise
        .then((data: any) => {
            const code = options?.success
                ? options.success
                : data?.data?.messageCode;
            message.open({
                key,
                type: 'success',
                content: messages(code),
                duration: 4,
            });
            return data;
        })
        .catch((error: any) => {
            const code = options?.error
                ? options.error
                : error?.response?.data?.messageCode;
            message.open({
                key,
                type: 'error',
                content: messages(code),
                duration: 4,
            });
            throw error;
        });
};
