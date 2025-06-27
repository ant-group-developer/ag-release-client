import SeeMoreButton from '@/components/ui/button/see-more-button';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ChartNoAxesCombined, ChartPie, List } from 'lucide-react';
import { TOP_LIST_TYPE } from '../../enums';

type Props = {
    title: string;
    initialTab: TOP_LIST_TYPE;
    setActiveTab: (tab: TOP_LIST_TYPE) => void;
    activeTab: TOP_LIST_TYPE;
    onClickSeeAll?: () => void;
};

export default function TopListHeader({
    title,
    initialTab,
    setActiveTab,
    activeTab,
    onClickSeeAll,
}: Props) {
    return (
        <div className="flex flex-col">
            <p className="px-2 text-lg font-bold">{title}</p>
            <div className="flex items-center justify-between gap-2">
                <div className="flex h-8 w-[120px] cursor-pointer items-center justify-between rounded-2xl bg-card-bg dark:bg-card-bg-dark">
                    <List
                        size={SIZE_ICON}
                        className={cn('flex-1 text-gray-400', {
                            'text-black': activeTab === TOP_LIST_TYPE.LIST,
                        })}
                        onClick={() => setActiveTab(TOP_LIST_TYPE.LIST)}
                    />
                    <ChartNoAxesCombined
                        size={SIZE_ICON}
                        className={cn('flex-1 text-gray-400', {
                            'text-black': activeTab === TOP_LIST_TYPE.BAR,
                        })}
                        onClick={() => setActiveTab(TOP_LIST_TYPE.BAR)}
                    />
                    <ChartPie
                        size={SIZE_ICON}
                        className={cn('flex-1 text-gray-400', {
                            'text-black': activeTab === TOP_LIST_TYPE.PIE,
                        })}
                        onClick={() => setActiveTab(TOP_LIST_TYPE.PIE)}
                    />
                </div>
                <SeeMoreButton onClick={onClickSeeAll} />
            </div>
        </div>
    );
}
