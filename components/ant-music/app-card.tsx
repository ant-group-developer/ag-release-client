import { cn } from '@/helpers/tailwind';
import { Button, ButtonProps } from 'antd';
import { ReactNode } from 'react';

type Props = {
    icon?: ReactNode;
    title: ReactNode;
    headerButtonText?: string | undefined;
    headerButtonProps?: ButtonProps;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export default function AppCard({
    icon,
    title,
    headerButtonText,
    headerButtonProps,
    children,
    className,
    style,
}: Props) {
    return (
        <div
            className={cn('flex flex-col rounded-lg border', className)}
            style={style}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 p-4 py-2 text-base font-bold">
                    {icon} {title}
                </div>
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
