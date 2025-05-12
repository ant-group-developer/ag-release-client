import { cn } from '@/helpers/common';
import { Tooltip, TooltipProps } from 'antd';

type TOOLTIP_SIZE = 'small' | 'medium';

type Props = TooltipProps & {
    size?: TOOLTIP_SIZE;
    className?: string;
};

export default function CustomTooltip({ size, className, ...props }: Props) {
    const smallOverlayInnerStyle =
        size == 'small'
            ? {
                  padding: '0 8px 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '20px',
              }
            : {};

    return (
        <Tooltip
            {...props}
            className={cn(className)}
            overlayClassName={cn({ '!text-xs': size === 'small' })}
            overlayInnerStyle={{ ...smallOverlayInnerStyle }}
        />
    );
}
