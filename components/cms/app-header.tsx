import { cn } from '@/helpers/common';
import { CSSProperties, ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
};

type AppHeaderGroupProps = {
    children: ReactNode;
    className?: string;
    position?: 'start' | 'end';
};

export default function AppHeader({ children, className, style }: Props) {
    return (
        <div
            className={cn(
                'flex flex-col-reverse justify-between gap-2 px-4 py-1 lg:flex-row lg:items-center',
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
}

export function AppHeaderGroup({
    children,
    className,
    position,
}: AppHeaderGroupProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col flex-wrap items-center gap-2 lg:flex-row',
                { 'lg:justify-end': position === 'end' },
                className
            )}
        >
            {children}
        </div>
    );
}
