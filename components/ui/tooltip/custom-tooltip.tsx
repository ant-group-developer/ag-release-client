import { cn } from '@/helpers/common';
import { Tooltip, TooltipProps } from 'antd';

type TOOLTIP_SIZE = 'small' | 'medium';

export type CustomTooltipProps = TooltipProps & {
    size?: TOOLTIP_SIZE;
    className?: string;
};

export default function CustomTooltip({
    size,
    className,
    ...props
}: CustomTooltipProps) {
    const smallOverlayInnerStyle =
        size == 'small'
            ? {
                  padding: '0 8px 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '20px',
                  whiteSpace: 'pre-line',
              }
            : {};

    return (
        <Tooltip
            {...props}
            className={cn(className)}
            overlayClassName={cn(props?.overlayClassName, {
                '!text-xs': size === 'small',
            })}
            overlayInnerStyle={{
                ...smallOverlayInnerStyle,
                ...props.overlayInnerStyle,
            }}
        />
    );
}
