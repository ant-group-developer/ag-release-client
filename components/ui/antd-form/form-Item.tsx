import { cn } from '@/helpers/tailwind';
import { Form, FormItemProps } from 'antd';
import { ReactNode } from 'react';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type AppFormItemProps = {
    children: ReactNode;
    tooltipInfo?: string;
} & FormItemProps;

function AppFormItem({
    children,
    className,
    label,
    required,
    tooltipInfo,
    ...props
}: AppFormItemProps) {
    const customLabel = label ? (
        <div className="flex items-center gap-1">
            <span className="flex gap-1 font-bold">
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </span>
            {tooltipInfo && <IconInfoTooltip title={tooltipInfo} />}
        </div>
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
