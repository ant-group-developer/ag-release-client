'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { Alert } from 'antd';
import { AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface ErrorAlertProps {
    label: string;
    message: string;
    clickable?: boolean;
    action?: ReactNode;
}

export default function ErrorAlert({
    label,
    message,
    clickable = true,
    action,
}: ErrorAlertProps) {
    return (
        <Alert
            className={cn(
                'custom-alert-sidebar !px-[14px] !py-3 !text-sm',
                clickable && 'cursor-pointer hover:underline'
            )}
            message={
                <div className="flex max-w-full items-center gap-2 text-xs font-medium dark:text-white">
                    <div className="min-w-0 flex-1 truncate">
                        <CustomTooltip title={label}>{label}</CustomTooltip>
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            }
            description={
                <p className="line-clamp-3 text-xs" title={message}>
                    {message}
                </p>
            }
            type="error"
            showIcon
            icon={
                <AlertCircle size={SIZE_ICON} className="mt-1 text-red-500" />
            }
        />
    );
}
