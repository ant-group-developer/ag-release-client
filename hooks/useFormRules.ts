import { useTranslations } from 'next-intl';

export const useFormRules = () => {
    const messages = useTranslations();

    return {
        required: (customMessage?: string) => ({
            required: true,
            message: customMessage || messages('validation.input'),
        }),

        email: (customMessage?: string) => ({
            type: 'email' as const,
            message: customMessage || messages('validation.email'),
        }),

        minLength: (field: string, min: number, customMessage?: string) => ({
            type: 'number',
            min,
            message:
                customMessage ||
                messages('validation.numberMin', { min, field }),
        }),

        maxLength: (max: number, field: string, customMessage?: string) => ({
            type: 'number',
            max,
            message:
                customMessage ||
                messages('validation.numberMax', { max, field }),
        }),

        stringMax: (max: number, field: string, customMessage?: string) => ({
            max,
            message:
                customMessage ||
                messages('validation.stringMax', { max, field }),
        }),

        stringMin: (min: number, field: string, customMessage?: string) => ({
            min,
            message:
                customMessage ||
                messages('validation.stringMin', { min, field }),
        }),

        pattern: (pattern: RegExp, customMessage: string) => ({
            pattern,
            message: customMessage,
        }),
    };
};
