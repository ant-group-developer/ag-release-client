'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { Card, Empty, Segmented, Skeleton, Table } from 'antd';
import { BarChart3, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import RankingBar from './ranking-bar';

export enum RankingCardView {
    LIST = 'list',
    BAR = 'bar',
}

interface RankingCardProps<T> {
    title: string;
    columns: any[];
    dataSource: T[] | undefined;
    loading: boolean;
    rowKey: string;
    scrollX?: number;
    labelKey: keyof T;
    valueKey: keyof T;
    defaultView?: RankingCardView;
}

export default function RankingCard({
    title,
    columns,
    dataSource,
    loading,
    rowKey,
    scrollX = 500,
    labelKey,
    valueKey,
    defaultView = RankingCardView.LIST,
}: RankingCardProps<any>) {
    const [viewType, setViewType] = useState<RankingCardView>(defaultView);
    const messages = useTranslations();

    return (
        <Card
            title={
                <span className="font-bold text-gray-800 dark:text-zinc-100">
                    {title}
                </span>
            }
            extra={
                <Segmented
                    options={[
                        {
                            value: RankingCardView.LIST,
                            label: (
                                <CustomTooltip
                                    title={messages('common.list')}
                                    size="small"
                                >
                                    <div className="flex h-full items-center justify-center">
                                        <List size={SIZE_ICON} height={22} />
                                    </div>
                                </CustomTooltip>
                            ),
                        },
                        {
                            value: RankingCardView.BAR,
                            label: (
                                <CustomTooltip
                                    title={messages('common.barChart')}
                                    size="small"
                                >
                                    <div className="flex h-full items-center justify-center">
                                        <BarChart3
                                            size={SIZE_ICON}
                                            height={22}
                                        />
                                    </div>
                                </CustomTooltip>
                            ),
                        },
                    ]}
                    value={viewType}
                    onChange={(value) => setViewType(value as RankingCardView)}
                    size="small"
                />
            }
            className="h-full rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '12px 24px 24px 24px' } }}
        >
            {viewType === RankingCardView.LIST ? (
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={rowKey}
                    pagination={false}
                    scroll={{ x: scrollX }}
                    size="small"
                />
            ) : loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : !dataSource || dataSource.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <RankingBar
                    data={dataSource}
                    labelKey={labelKey}
                    valueKey={valueKey}
                />
            )}
        </Card>
    );
}
