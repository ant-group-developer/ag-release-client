import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

interface ApiErrorResponse {
    message: string | string[];
    messageCode: string;
    error: string;
    statusCode: number;
}

export function useApiNotify() {
    const messages = useTranslations();

    const handleError = (error: unknown) => {
        let messageList: string[] = [];

        if (error instanceof AxiosError) {
            const errorResponse = error.response?.data as ApiErrorResponse;
            if (
                errorResponse?.messageCode &&
                messages.has(errorResponse.messageCode as any)
            ) {
                messageList.push(errorResponse.messageCode);
            } else {
                if (Array.isArray(errorResponse.message)) {
                    messageList = messageList.concat(errorResponse.message);
                } else {
                    messageList.push(errorResponse.message);
                }
            }
        } else if (error instanceof Error) {
            messageList.push(error.message);
        } else {
            messageList.push('An unknown error occurred');
        }

        messageList.forEach((message) => {
            toast.error(messages(message as any), {
                toastId: message,
            });
        });
    };

    const handleSuccess = (message: string) => {
        // Kiểm tra xem message có phải là messageCode (translation key) không
        if (messages.has(message as any)) {
            toast.success(messages(message as any), {
                toastId: message,
            });
        } else {
            // Nếu không phải messageCode thì hiển thị message trực tiếp
            toast.success(message, {
                toastId: message,
            });
        }
    };

    return { handleError, handleSuccess };
}
