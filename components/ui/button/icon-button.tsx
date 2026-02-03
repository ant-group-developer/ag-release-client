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
            shape = 'square',
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
                    'inline-grid aspect-square min-w-8 flex-none cursor-pointer place-content-center p-1.5 text-base hover:bg-gray-200',
                    {
                        '!hidden': hidden,
                        'rounded-full': shape === 'circle',
                        'rounded-lg': shape === 'square',
                        'bg-gray-200/70': variant === 'filled',
                        'border border-gray-300': variant === 'outlined',
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
