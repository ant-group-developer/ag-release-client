import { cn } from '@/helpers/common';
import { message, Tooltip, TooltipProps } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

interface CopyTextProps {
    text: string;
    label?: string;
    children?: React.ReactNode;
    className?: string;
    tooltipProps?: TooltipProps;
}

const CopyText: React.FC<CopyTextProps> = ({
    text,
    // label = 'Text',
    children,
    className,
    tooltipProps,
}) => {
    const messages = useTranslations();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard
            .writeText(text)
            .then(() => message.success(`${messages('common.copied')}`));
    };

    return (
        <Tooltip
            {...tooltipProps}
            title={tooltipProps?.title || messages('common.copy')}
        >
            <div
                onClick={handleCopy}
                className={cn(
                    'w-fit cursor-pointer overflow-hidden rounded px-1 hover:bg-gray-200',
                    className
                )}
            >
                {children || text}
            </div>
        </Tooltip>
    );
};

export default CopyText;
