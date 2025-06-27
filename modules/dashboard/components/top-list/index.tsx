import { cn } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TOP_LIST_TYPE } from '../../enums';
import BarChart from '../bar-chart';
import DonutChart from '../donut-chart/donut-chart';
import TopListHeader from './top-list-header';
import TopListRow from './track-row';

type Props = {
    className?: string;
    title: string;
    description: string;
    data: {
        image?: string;
        title: string;
        artist?: string;
        plays?: number;
        value?: number;
    }[];
    initialTab: TOP_LIST_TYPE;
    typeShapeImage?: 'circle' | 'square';
    onClickSeeAll?: () => void;
};

export default function TopList({
    data,
    className,
    title,
    description,
    initialTab = TOP_LIST_TYPE.LIST,
    typeShapeImage = 'square',
    onClickSeeAll,
}: Props) {
    const messages = useTranslations();
    const [activeTab, setActiveTab] = useState<TOP_LIST_TYPE>(initialTab);

    return (
        <div
            className={cn('rounded-lg border dark:border-zinc-800', className)}
        >
            <div className="p-4">
                <TopListHeader
                    title={title}
                    initialTab={initialTab}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    onClickSeeAll={onClickSeeAll}
                />
            </div>

            {activeTab === TOP_LIST_TYPE.LIST && (
                <div className="flex flex-col">
                    <p className="flex justify-between px-5 py-2 text-gray-500">
                        <span>{description}</span>{' '}
                        <span> {messages('common.plays')} </span>
                    </p>
                    {data.map((item, index) => {
                        const dataRow = {
                            image: item.image,
                            title: item.title,
                            artist: item.artist,
                            plays: item.plays,
                        };
                        return (
                            <TopListRow
                                data={dataRow}
                                key={index}
                                typeShapeImage={typeShapeImage}
                                index={index}
                            />
                        );
                    })}
                </div>
            )}

            {activeTab === TOP_LIST_TYPE.BAR && (
                <BarChart
                    data={data.map((item) => ({
                        category: item.title,
                        value: item.plays || 0,
                    }))}
                />
            )}

            {activeTab === TOP_LIST_TYPE.PIE && (
                <DonutChart
                    title={title}
                    data={data.map((item) => ({
                        category: item.title,
                        value: item.plays || 0,
                    }))}
                    showCenterLabel={false}
                />
            )}
        </div>
    );
}
