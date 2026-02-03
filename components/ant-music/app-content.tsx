import { cn } from '@/helpers/common';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

function AppContent({ className, children }: Props) {
    return (
        <div className={cn('flex h-full flex-col justify-between', className)}>
            {children}
        </div>
    );
}

export default AppContent;
