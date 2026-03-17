import { message } from '@/helpers/antd-static';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';

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

        messageList.forEach((msg) => {
            message.error({
                content: messages(msg as any),
                key: msg,
            });
        });
    };

    const handleSuccess = (res: any) => {
        const msg = res.messageCode || res.message;

        if (!msg) return;

        if (messages.has(msg as any)) {
            message.success({
                content: messages(msg as any),
                key: msg,
            });
        } else {
            message.success({
                content: msg,
                key: msg,
            });
        }
    };
    return { handleError, handleSuccess };
}
