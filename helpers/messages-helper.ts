import { message } from '@/helpers/antd-static';

type TypeOptions = 'success' | 'error' | 'info' | 'warning';

export const showNotification = (
    type: TypeOptions,
    content: string,
    options?: { duration?: number; key?: string }
) => {
    const duration = (options?.duration ?? 3000) / 1000;
    const key = options?.key ?? content ?? 'Something went wrong, try again';

    message[type]({
        content,
        duration,
        key,
    });
};

export const hideNotification = (key: string) => {
    message.destroy(key);
};

export const isToastActive = (_key?: string) => {
    // Ant Design message does not support checking active state
    return false;
};

export const showNotificationLoading = (content?: string) => {
    const key = content ?? 'loading';
    message.loading({
        content: content ?? 'Loading, please wait a few seconds',
        duration: 0, // persist until manually closed
        key,
    });
    return key;
};

export const notificationSuccess = (key: string, content?: string) => {
    message.success({
        content: content ?? 'Completed',
        duration: 2,
        key,
    });
};

export const notificationError = (key: string, content?: string) => {
    message.error({
        content: content ?? 'Failure',
        duration: 2,
        key,
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
) => {
    const key = 'promise-' + Date.now();

    message.loading({
        content: options?.pending ?? messages('common.processing'),
        key,
        duration: 0,
    });

    return promise
        .then((data: any) => {
            const code = options?.success
                ? options.success
                : data?.data?.messageCode;
            message.success({
                content: messages(code),
                key,
                duration: 2,
            });
            return data;
        })
        .catch((error: any) => {
            const code = options?.error
                ? options.error
                : error?.response?.data?.messageCode;
            message.error({
                content: messages(code),
                key,
                duration: 2,
            });
            throw error;
        });
};
