import { cn } from '@/helpers/common';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

type AppHeaderGroupProps = {
    children: ReactNode;
    className?: string;
    position?: 'start' | 'end';
};

export default function AppHeader({ children, className }: Props) {
    return (
        <div
            className={cn(
                'flex flex-col-reverse justify-between gap-2 border-b px-4 py-0 lg:flex-row lg:items-center',
                className
            )}
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
