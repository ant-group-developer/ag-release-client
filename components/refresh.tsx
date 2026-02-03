import { SIZE_ICON } from '@/constants/common';
import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import IconButton from './ui/button/icon-button';
import CustomTooltip from './ui/tooltip/custom-tooltip';

type Props = {
    lastTimeUpdated?: string;
    handleRefresh: () => void;
    className?: string;
};

export default function Refresh({
    className,
    lastTimeUpdated,
    handleRefresh,
}: Props) {
    const messages = useTranslations();

    return (
        <div>
            <div className="flex h-8 min-w-52 items-center gap-1 text-nowrap">
                <p className={className}>
                    {messages('common.lastTimeUpdated')} {lastTimeUpdated}
                </p>
                {/* <span className="text-xs">{messages('common.hasNewData')}</span> */}
                <CustomTooltip title={messages('common.refresh')}>
                    <IconButton onClick={handleRefresh}>
                        <RotateCw size={SIZE_ICON} />
                    </IconButton>
                </CustomTooltip>
            </div>
        </div>
    );
}
