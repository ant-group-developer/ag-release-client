import { cn } from '@/helpers/tailwind';
import { Form, FormItemProps, Typography } from 'antd';
import { ReactNode } from 'react';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type AppFormItemProps = {
    children: ReactNode;
    tooltipInfo?: string;
    tooltipIconClassName?: string;
} & FormItemProps;

function AppFormItem({
    children,
    className,
    label,
    required,
    tooltipInfo,
    tooltipIconClassName,
    ...props
}: AppFormItemProps) {
    const isRequired =
        required ||
        (Array.isArray(props.rules) &&
            props.rules.some((rule: any) => rule && rule.required));

    const customLabel = label ? (
        <div className="flex items-center gap-1">
            <span className="flex gap-1 font-normal">
                <Typography.Text
                    style={{
                        color: '#65696e',
                    }}
                    type="secondary"
                    className="dark:!text-white"
                >
                    {label}
                </Typography.Text>
                {isRequired && <span style={{ color: 'red' }}> *</span>}
            </span>
            {tooltipInfo && (
                <IconInfoTooltip
                    title={tooltipInfo}
                    iconClassName={tooltipIconClassName}
                />
            )}
        </div>
    ) : (
        label
    );

    return (
        <Form.Item
            {...props}
            colon={false}
            className={cn('app-form-item !mb-3', className)}
            label={customLabel}
            required={false}
        >
            {children}
        </Form.Item>
    );
}

export default AppFormItem;
