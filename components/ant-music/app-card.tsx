import { cn } from '@/helpers/tailwind';
import { Button, ButtonProps } from 'antd';
import { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    headerButtonText?: string | undefined;
    headerButtonProps?: ButtonProps;
    children: React.ReactNode;
    className?: string;
};

export default function AppCard({
    title,
    headerButtonText,
    headerButtonProps,
    children,
    className,
}: Props) {
    return (
        <div className={cn('flex flex-col rounded-lg border', className)}>
            <div className="flex items-center justify-between">
                <div className="p-4 py-2 text-base font-bold">{title}</div>
                {headerButtonText && (
                    <div className="px-2 py-2">
                        <Button shape="round" {...headerButtonProps}>
                            {headerButtonText}
                        </Button>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
