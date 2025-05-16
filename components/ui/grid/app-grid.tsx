import { cn } from '@/helpers/common';
import React from 'react';

type Props = {
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
};

export default function AppGrid({ className, children, style }: Props) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7',
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
}
