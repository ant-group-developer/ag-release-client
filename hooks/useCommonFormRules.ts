import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useTranslations } from 'next-intl';

type ParamsStringMax = {
    max?: number;
    field: string;
};

type ParamsStringMin = {
    min?: number;
    field: string;
};

export const useCommonFormRules = () => {
    const messages = useTranslations();

    return {
        required: (customMessage?: string) => ({
            required: true,
            message: customMessage || messages('validation.input'),
        }),

        email: () => ({
            type: 'email' as const,
            message: messages('validation.email'),
        }),

        stringMax: ({ max = MAX_NAME_LENGTH, field }: ParamsStringMax) => ({
            max,
            message: messages('validation.stringMax', { max, field }),
        }),

        stringMin: ({ min = 0, field }: ParamsStringMin) => ({
            min,
            message: messages('validation.stringMin', { min, field }),
        }),
    };
};
