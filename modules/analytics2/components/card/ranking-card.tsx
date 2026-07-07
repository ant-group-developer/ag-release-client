'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { Link } from '@/i18n/routing';
import { Button, Card, Empty, Segmented, Skeleton, Space, Table } from 'antd';
import { ArrowRight, BarChart3, List, PieChart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import RankingBar from '../ranking/ranking-bar';
import RankingPie from '../ranking/ranking-pie';

export enum RankingCardView {
    LIST = 'list',
    BAR = 'bar',
    PIE = 'pie',
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
    viewMoreHref?: string;
    valuePrefix?: string;
    onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
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
    viewMoreHref,
    valuePrefix,
    onChange,
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
                <Space>
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
                                            <List
                                                size={SIZE_ICON}
                                                height={22}
                                            />
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
                            {
                                value: RankingCardView.PIE,
                                label: (
                                    <CustomTooltip
                                        title={messages('common.pieChart')}
                                        size="small"
                                    >
                                        <div className="flex h-full items-center justify-center">
                                            <PieChart
                                                size={SIZE_ICON}
                                                height={22}
                                            />
                                        </div>
                                    </CustomTooltip>
                                ),
                            },
                        ]}
                        value={viewType}
                        onChange={(value) =>
                            setViewType(value as RankingCardView)
                        }
                        size="small"
                    />
                    {viewMoreHref && (
                        <Link href={viewMoreHref} className="group">
                            <Button
                                type="text"
                                size="small"
                                className="!flex !items-center !gap-1 !rounded-full !px-3 !py-1 !font-medium !text-gray-500 hover:!bg-gray-100 hover:!text-blue-600 dark:!text-zinc-400 dark:hover:!bg-zinc-800 dark:hover:!text-blue-400"
                            >
                                <span className="text-xs">{messages('common.seeMore')}</span>
                                <ArrowRight
                                    size={12}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                            </Button>
                        </Link>
                    )}
                </Space>
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
                    tableLayout="fixed"
                    onChange={onChange}
                />
            ) : loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : !dataSource || dataSource.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : viewType === RankingCardView.BAR ? (
                <RankingBar
                    data={dataSource}
                    labelKey={labelKey}
                    valueKey={valueKey}
                />
            ) : (
                <RankingPie
                    data={dataSource}
                    labelKey={labelKey}
                    valueKey={valueKey}
                    valuePrefix={valuePrefix}
                />
            )}
        </Card>
    );
}
