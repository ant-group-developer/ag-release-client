import { cn } from '@/helpers/tailwind';
import { Form, FormItemProps } from 'antd';
import { ReactNode } from 'react';

type AppFormItemProps = {
    children: ReactNode;
} & FormItemProps;

function AppFormItem({
    children,
    className,
    label,
    required,
    ...props
}: AppFormItemProps) {
    const customLabel = label ? (
        <span className="font-bold">
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
        </span>
    ) : (
        label
    );

    return (
        <Form.Item
            {...props}
            className={cn('app-form-item !mb-3', className)}
            label={customLabel}
            required={false}
        >
            {children}
        </Form.Item>
    );
}

export default AppFormItem;
