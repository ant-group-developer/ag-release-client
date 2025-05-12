import { cn } from '@/helpers/common';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

function AppContent({ className, children }: Props) {
    return (
        <div
            className={cn(
                'grow overflow-hidden rounded-2xl border-0 bg-white',
                className
            )}
        >
            {children}
        </div>
    );
}

export default AppContent;
