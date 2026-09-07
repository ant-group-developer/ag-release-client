'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import {
    Button,
    Card,
    Empty,
    Popover,
    Segmented,
    Skeleton,
    Space,
    Table,
} from 'antd';
import {
    ArrowRight,
    BarChart3,
    List,
    MoreVertical,
    PieChart,
} from 'lucide-react';
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
    onViewMore?: () => void;
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
    onViewMore,
    valuePrefix,
    onChange,
}: RankingCardProps<any>) {
    const [viewType, setViewType] = useState<RankingCardView>(defaultView);
    const messages = useTranslations();

    const renderControls = (isMobile = false) => (
        <Space
            size={6}
            direction={isMobile ? 'vertical' : 'horizontal'}
            className={isMobile ? 'w-48' : ''}
        >
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
                                    <BarChart3 size={SIZE_ICON} height={22} />
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
                                    <PieChart size={SIZE_ICON} height={22} />
                                </div>
                            </CustomTooltip>
                        ),
                    },
                ]}
                value={viewType}
                onChange={(value) => setViewType(value as RankingCardView)}
                size="small"
                className={
                    isMobile
                        ? 'w-full [&_.ant-segmented-group]:w-full [&_.ant-segmented-item]:flex-1'
                        : ''
                }
            />
            <Button
                onClick={() => onViewMore?.()}
                type="text"
                size="small"
                className={`!flex !items-center !gap-1 !rounded-full !py-1 !font-medium !text-gray-500 hover:!bg-gray-100 hover:!text-blue-600 dark:!text-zinc-400 dark:hover:!bg-zinc-800 dark:hover:!text-blue-400 ${
                    isMobile
                        ? '!w-full !justify-center !bg-gray-100 !px-3 dark:!bg-zinc-800'
                        : '!px-2 sm:!px-3'
                }`}
            >
                <span className="text-xs">{messages('common.seeMore')}</span>
                <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
            </Button>
        </Space>
    );

    return (
        <Card
            title={
                <CustomTooltip title={title} placement="topLeft">
                    <span className="block truncate font-bold text-gray-800 dark:text-zinc-100">
                        {title}
                    </span>
                </CustomTooltip>
            }
            extra={
                <>
                    <div className="hidden sm:block">
                        {renderControls(false)}
                    </div>
                    <div className="block sm:hidden">
                        <Popover
                            content={renderControls(true)}
                            trigger="click"
                            placement="bottomRight"
                            overlayClassName="[&_.ant-popover-inner]:!p-2"
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={
                                    <MoreVertical
                                        size={18}
                                        className="text-gray-600 dark:text-zinc-300"
                                    />
                                }
                                className="!flex !items-center !justify-center !rounded-lg !p-1.5"
                            />
                        </Popover>
                    </div>
                </>
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
                    scroll={{ x: '100%' }}
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
