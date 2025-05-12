import { cn } from '@/helpers/common';
import React from 'react';

export interface IconButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    hidden?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ hidden, className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                {...props}
                className={cn(
                    'inline-grid aspect-square w-8 flex-none place-content-center rounded-full text-base hover:bg-gray-300/70',
                    {
                        '!hidden': hidden,
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
