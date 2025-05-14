import SeeMoreButton from '@/components/ui/button/see-more-button';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ChartNoAxesCombined, ChartPie, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TOP_LIST_TYPE } from '../../enums';
import BarChart from '../bar-chart';
import DonutChart from '../donut-chart';
import TopListRow from './track-row';

type Props = {
    className?: string;
    title: string;
    description: string;
    data: AlbumData[];
    initialTab: TOP_LIST_TYPE;
};

export default function TopList({
    data,
    className,
    title,
    description,
    initialTab = TOP_LIST_TYPE.LIST,
}: Props) {
    const messages = useTranslations();
    const [activeTab, setActiveTab] = useState<TOP_LIST_TYPE>(initialTab);

    return (
        <div className={cn('rounded-lg border bg-white', className)}>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <p className="px-2 text-lg font-bold">{title}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-[120px] cursor-pointer items-center justify-between rounded-2xl bg-card-bg">
                            <List
                                size={SIZE_ICON}
                                className={cn('flex-1 text-gray-500', {
                                    'text-black':
                                        activeTab === TOP_LIST_TYPE.LIST,
                                })}
                                onClick={() => setActiveTab(TOP_LIST_TYPE.LIST)}
                            />
                            <ChartNoAxesCombined
                                size={SIZE_ICON}
                                className={cn('flex-1 text-gray-500', {
                                    'text-black':
                                        activeTab === TOP_LIST_TYPE.BAR,
                                })}
                                onClick={() => setActiveTab(TOP_LIST_TYPE.BAR)}
                            />
                            <ChartPie
                                size={SIZE_ICON}
                                className={cn('flex-1 text-gray-500', {
                                    'text-black':
                                        activeTab === TOP_LIST_TYPE.PIE,
                                })}
                                onClick={() => setActiveTab(TOP_LIST_TYPE.PIE)}
                            />
                        </div>
                        <SeeMoreButton />
                    </div>
                </div>
            </div>

            {activeTab === TOP_LIST_TYPE.LIST && (
                <div className="flex flex-col">
                    <p className="flex justify-between px-5 py-2 text-gray-500">
                        <span>{description}</span>{' '}
                        <span> {messages('common.plays')} </span>
                    </p>
                    {data.map((item, index) => {
                        if (index >= 5) return;
                        const dataRow = {
                            id: item.id,
                            image: item.image,
                            title: item.title,
                            artist: item.artist,
                            plays: '41.232 (15,8%)',
                        };
                        return <TopListRow data={dataRow} key={index} />;
                    })}
                </div>
            )}

            {activeTab === TOP_LIST_TYPE.BAR && (
                <BarChart
                    data={data.slice(0, 5).map((item) => ({
                        category: item.title,
                        value: item.tracks,
                    }))}
                />
            )}

            {activeTab === TOP_LIST_TYPE.PIE && (
                <DonutChart
                    title={title}
                    data={data.slice(0, 5).map((item) => ({
                        category: item.title,
                        value: item.tracks,
                    }))}
                    showCenterLabel={false}
                />
            )}
        </div>
    );
}
