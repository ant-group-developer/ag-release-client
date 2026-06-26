import { SIZE_ICON } from '@/constants/common';
import { Loader2, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionTitleProps {
    title: string;
    count: number;
    loading: boolean;
    color: string;
    Icon: LucideIcon;
    action?: ReactNode;
}

export default function SectionTitle({
    title,
    count,
    loading,
    color,
    Icon,
    action,
}: SectionTitleProps) {
    return (
        <div
            className="flex items-center gap-2 rounded-md px-1 py-1 text-xs font-semibold"
            style={{ color }}
        >
            {loading ? (
                <Loader2 size={SIZE_ICON - 2} className="animate-spin" />
            ) : (
                <Icon size={SIZE_ICON - 2} />
            )}
            <span className="min-w-0 flex-1 truncate">{title}</span>
            {action}
            <span className="shrink-0">({count})</span>
        </div>
    );
}
