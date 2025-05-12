import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';
import CustomTooltip from './tooltip/custom-tooltip';

type Props = PropsWithChildren & {
    onClick?: () => void;
    onRemove?: () => void;
    className?: string;
};

function Chip({ children, className, onClick, onRemove }: Props) {
    const messages = useTranslations();
    return (
        <div
            className={cn(
                'chip-filter flex flex-none items-center gap-2 rounded-lg bg-gray-100 px-2 font-semibold hover:bg-gray-200',
                className
            )}
        >
            <div
                className="ellipsis max-w-80 grow cursor-pointer truncate"
                onClick={onClick}
            >
                {children}
            </div>
            {onRemove && (
                <button
                    // title={messages('filter.remove')}
                    className="px-1 py-2"
                    onClick={onRemove}
                >
                    <CustomTooltip title={messages('common.delete')}>
                        <X size={SIZE_ICON} />
                    </CustomTooltip>
                </button>
            )}
        </div>
    );
}

export { Chip };
