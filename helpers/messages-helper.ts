import { Id, ToastOptions, TypeOptions, toast } from 'react-toastify';

export const showNotification = (
    type: TypeOptions,
    message: string,
    toastOptions?: ToastOptions
) => {
    const options: ToastOptions = {
        autoClose: 3000,
        ...toastOptions,
        type,
    };

    toast(message, {
        ...options,
        toastId: message ?? 'Some thing went wrong, try again',
    });
};

export const hideNotification = (toastId: ToastOptions['toastId']) => {
    toast.dismiss(toastId);
};

export const isToastActive = (toastId: ToastOptions['toastId']) => {
    if (toastId === undefined) return false;
    return toast.isActive(toastId);
};

export const showNotificationLoading = (message?: string) => {
    return toast.loading(message ?? 'Loading, please wait a few seconds');
};

export const notificationSuccess = (id: Id, message?: string) => {
    return toast.update(id, {
        render: message ?? 'Completed',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
    });
};

export const notificationError = (id: Id, message?: string) => {
    return toast.update(id, {
        render: message ?? 'Failure',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
    });
};
