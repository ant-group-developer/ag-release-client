import { Button, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { CSSProperties, ReactNode } from 'react';

type Props = {
    icon?: ReactNode;
    iconBgColor?: string;
    title: string;
    value?: string | number;
    className?: string;
    style?: CSSProperties;
};

export default function StatItem({
    icon,
    title,
    value,
    iconBgColor,
    className,
    style,
}: Props) {
    const messages = useTranslations();
    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-lg p-4 ${className}`}
            style={style}
        >
            <div className="flex items-center gap-4">
                {icon && (
                    <div className={`rounded-full p-3 ${iconBgColor} `}>
                        {icon}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-md font-semibold">{title}</span>
                    <Typography.Text type="secondary">{value}</Typography.Text>
                </div>
            </div>
            <Button type="default" shape="round">
                {messages('common.viewDetail')}
            </Button>
        </div>
    );
}
