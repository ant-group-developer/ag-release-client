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

type AppFormComponent = React.FC<AppFormProps> & {
    useForm: typeof Form.useForm;
    useFormInstance: typeof Form.useFormInstance;
    useWatch: typeof Form.useWatch;
    Item: typeof Form.Item;
    List: typeof Form.List;
    ErrorList: typeof Form.ErrorList;
    Provider: typeof Form.Provider;
};

const AppForm: AppFormComponent = ({
    children,
    submitText,
    showSubmit = true,
    submitProps,
    submitRootClassName,
    ...props
}: AppFormProps) => {
    const messages = useTranslations();
    const formLayout =
        props.layout === 'vertical' ? FORM_LAYOUT_VERTICAL : FORM_LAYOUT;
    return (
        <Form
            autoComplete="off"
            {...formLayout}
            requiredMark={(label, info) => (
                <div className="font-medium">
                    {label}{' '}
                    {info.required && <span className="text-red-500">*</span>}
                </div>
            )}
            {...props}
        >
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
};

AppForm.useForm = Form.useForm;
AppForm.useFormInstance = Form.useFormInstance;
AppForm.useWatch = Form.useWatch;
AppForm.Item = Form.Item;
AppForm.List = Form.List;
AppForm.ErrorList = Form.ErrorList;
AppForm.Provider = Form.Provider;

export default AppForm;
