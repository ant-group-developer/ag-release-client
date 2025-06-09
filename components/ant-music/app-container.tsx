import { cn } from '@/helpers/common';
import { PropsWithChildren } from 'react';

type Props = {
    className?: string;
};

export default function AppContainer({
    children,
    className,
}: PropsWithChildren<Props>) {
    return <div className={cn('p2 lg:p-4', className)}>{children}</div>;
}
