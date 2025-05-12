import { cn } from '@/helpers/common';
import { Button, ButtonProps, Tooltip } from 'antd';
import React from 'react';

export interface FloatButtonProps extends ButtonProps {
    className?: string;
    tooltip?: string;
}

const FloatButton: React.FC<FloatButtonProps> = ({
    className,
    tooltip,
    ...props
}: FloatButtonProps) => {
    return (
        <Tooltip title={tooltip}>
            <Button
                className={cn('hover:opacity-90', className)}
                type="text"
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '20px',
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    // backgroundColor: '#1890ff',
                }}
                {...props}
            />
        </Tooltip>
    );
};

export default FloatButton;
