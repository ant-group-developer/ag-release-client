import { cn } from '@/helpers/common';
import React from 'react';

export interface IconButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    hidden?: boolean;
    shape?: 'circle' | 'square';
    variant?: 'filled' | 'borderless' | 'outlined';
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            hidden,
            className,
            children,
            shape = 'circle',
            variant = 'borderless',
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                {...props}
                className={cn(
                    'inline-grid aspect-square w-8 flex-none cursor-pointer place-content-center text-base hover:bg-gray-300/70',
                    {
                        '!hidden': hidden,
                        'rounded-full': shape === 'circle',
                        'rounded-lg': shape === 'square',
                        'bg-gray-200/70': variant === 'filled',
                        'border-gray-200/70': variant === 'outlined',
                    },
                    className
                )}
            >
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

export default IconButton;
