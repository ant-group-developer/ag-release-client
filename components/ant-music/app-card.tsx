import { cn } from '@/helpers/tailwind';
import { Button, ButtonProps } from 'antd';

type Props = {
    title: string;
    headerButtonText?: string;
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
        <div
            className={cn(
                'flex flex-col gap-2 rounded-lg border p-6',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="font-bold">{title}</div>
                {headerButtonText && (
                    <Button shape="round" {...headerButtonProps}>
                        {headerButtonText}
                    </Button>
                )}
            </div>
            {children}
        </div>
    );
}
