import { FORM_LAYOUT, FORM_LAYOUT_VERTICAL } from '@/constants/common';
import { cn } from '@/helpers/tailwind';
import { Button, ButtonProps, Form, FormProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export type AppFormProps = {
    children?: ReactNode;
    submitText?: ReactNode;
    showSubmit?: boolean;
    submitProps?: ButtonProps;
    submitRootClassName?: string;
} & Omit<FormProps, 'name'>;

function AppForm({
    children,
    submitText,
    showSubmit = true,
    submitProps,
    submitRootClassName,
    ...props
}: AppFormProps) {
    const messages = useTranslations();
    const formLayout =
        props.layout === 'vertical' ? FORM_LAYOUT_VERTICAL : FORM_LAYOUT;
    return (
        <Form {...formLayout} {...props}>
            {children}
            <div
                className={cn(
                    'text-right',
                    {
                        hidden: !showSubmit,
                    },
                    submitRootClassName
                )}
            >
                <Button type="primary" {...submitProps} htmlType="submit">
                    {submitText ?? messages('common.submit')}
                </Button>
            </div>
        </Form>
    );
}

export default AppForm;
