'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import { ContentItem } from '@/modules/analytics2/components/modal/advanced-mode/content-entity-selector';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
} from '@/modules/analytics2/constants/types';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
    type AnalyticsScopeParams,
} from '@/modules/analytics2/helpers';
import { useGetDspRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopDsp } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    BySourceItem,
    DspRankingItem,
    RevenueDspItem,
} from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { Card, Segmented, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PAGE = 1;

export interface DspRankingTableCardProps {
    dspId?: string;
    pgDspId?: string;
    dspReportId?: string;
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey?: ANALYTICS_METRIC_KEY;
    onMetricChange?: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled?: boolean;
    className?: string;
    paramPrefix?: string;
}

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    groupBySource?: boolean;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function DspRankingTableCard({
    dspId,
    pgDspId,
    dspReportId,
    scopeParams,
    fromDate,
    toDate,
    releaseType,
    metricKey,
    onMetricChange,
    onSelectEntity,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: DspRankingTableCardProps) {
    const messages = useTranslations();

    const effectiveFromDate = fromDate || ANALYTICS_DEFAULT_START_DATE;
    const effectiveToDate = toDate || ANALYTICS_DEFAULT_END_DATE;

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>(
            {
                page: DEFAULT_PAGE,
                pageSize: PAGE_SIZE_DEFAULT,
                startDate: effectiveFromDate,
                endDate: effectiveToDate,
                type: ANALYTICS_VIEW_TYPE.VIEW,
                releaseType: releaseType || ANALYTICS_RELEASE_TYPE.ALL,
            },
            { paramPrefix, history: paramPrefix ? 'replace' : 'push' }
        );

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(dataFilter.type ?? null)
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(() =>
            getAnalyticsReleaseType(dataFilter.releaseType ?? null)
        );

    useEffect(() => {
        if (releaseType !== undefined) {
            setSelectedReleaseType(releaseType);
        }
    }, [releaseType]);

    const [detailSourceModal, setDetailSourceModal] = useState<{
        open: boolean;
        title: string;
        sourceType: string;
    }>({
        open: false,
        title: '',
        sourceType: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = metricKey
        ? metricKey !== ANALYTICS_METRIC_KEY.TOTAL_VIEWS
        : currentType === ANALYTICS_VIEW_TYPE.REVENUE;
    const revenueSortBy =
        metricKey === ANALYTICS_METRIC_KEY.TOTAL_USAGE
            ? 'usage'
            : metricKey === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
              ? 'revenue'
              : undefined;

    const requestReleaseType =
        selectedReleaseType === ANALYTICS_RELEASE_TYPE.ALL
            ? undefined
            : selectedReleaseType;

    // Fetch ranking data (Views)
    const { dspRankingData, isFetching: isViewsFetching } = useGetDspRanking(
        {
            fromDate: effectiveFromDate,
            toDate: effectiveToDate,
            page,
            pageSize,
            keyword: dataFilter.keyword ?? undefined,
            groupBySource: true,
            releaseType: requestReleaseType,
            pgDspId: pgDspId || '',
            dspReportId: dspReportId || '',
            ...scopeParams,
        },
        { enabled: enabled && !isRevenue }
    );

    // Fetch revenue ranking data
    const { topDspData, isFetching: isRevenueFetching } = useGetRevenueTopDsp(
        {
            fromDate: effectiveFromDate,
            toDate: effectiveToDate,
            page,
            pageSize,
            keyword: dataFilter.keyword ?? undefined,
            includeOther: false,
            sortBy: revenueSortBy,
            groupBySource: true,
            releaseType: requestReleaseType,
            pgDspId: pgDspId || '',
            dspReportId: dspReportId || '',
            ...scopeParams,
        },
        { enabled: enabled && isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueDataWithRank = useMemo(() => {
        if (!topDspData?.items) return [];
        return topDspData.items.map((item: RevenueDspItem, index: number) => ({
            ...item,
            rank: (page - 1) * pageSize + index + 1,
        }));
    }, [topDspData, page, pageSize]);

    const viewsDataWithRank = useMemo(() => {
        if (!dspRankingData?.items) return [];
        return dspRankingData.items.map(
            (item: DspRankingItem, index: number) => ({
                ...item,
                rank: (page - 1) * pageSize + index + 1,
            })
        );
    }, [dspRankingData, page, pageSize]);

    const revenueColumns: ColumnsType<RevenueDspItem & { rank: number }> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('dsp.name'),
            dataIndex: 'sourceLabel',
            key: 'sourceLabel',
            width: 250,
            ellipsis: true,
            fixed: 'left',
            render: (
                text: string,
                record: RevenueDspItem & { rank: number }
            ) => (
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <Typography.Text
                        className="cursor-pointer transition-colors hover:text-blue-500"
                        onClick={() => {
                            // setDetailSourceModal({
                            //     open: true,
                            //     title: text || record.source || '',
                            //     sourceType: record.source || '',
                            // });
                            onSelectEntity?.({
                                id: record.source || '',
                                title: text || record.source || '',
                                type: ANALYTICS_ENTITY_TYPE.DSP,
                                thumbnailUrl: record.imageUrl ?? undefined,
                            });
                        }}
                    >
                        {text || record.source || '— '}
                    </Typography.Text>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (bySource?: BySourceItem[]) => {
                if (!bySource || bySource.length === 0) return '— ';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
                                        // setDetailSourceModal({
                                        //     open: true,
                                        //     title: item.sourceLabel,
                                        //     sourceType: item.source,
                                        // });
                                        onSelectEntity?.({
                                            id: item.source,
                                            title: item.sourceLabel,
                                            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                        });
                                    }}
                                >
                                    {item.sourceLabel}: $
                                    {formattedNumber(item.revenueUsd)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            fixed: 'right',
            render: (qty: number) => (
                <Typography.Text type="secondary">
                    {qty ? qty.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 180,
            fixed: 'right',
            render: (val: number) => (
                <Typography.Text>
                    ${val ? formattedNumber(val) : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewsColumns: ColumnsType<DspRankingItem & { rank: number }> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('dsp.name'),
            dataIndex: 'sourceLabel',
            key: 'sourceLabel',
            width: 250,
            ellipsis: true,
            fixed: 'left',
            render: (
                text: string,
                record: DspRankingItem & { rank: number }
            ) => (
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <Typography.Text
                        className="cursor-pointer transition-colors hover:text-blue-500"
                        onClick={() => {
                            // setDetailSourceModal({
                            //     open: true,
                            //     title: text || record.source || '',
                            //     sourceType: record.source || '',
                            // });
                            onSelectEntity?.({
                                id: record.source || '',
                                title: text || record.source || '',
                                type: ANALYTICS_ENTITY_TYPE.DSP,
                                thumbnailUrl: record.imageUrl ?? undefined,
                            });
                        }}
                    >
                        {text || record.source || '— '}
                    </Typography.Text>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (bySource?: BySourceItem[]) => {
                if (!bySource || bySource.length === 0) return '— ';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
                                        // setDetailSourceModal({
                                        //     open: true,
                                        //     title: item.sourceLabel,
                                        //     sourceType: item.source,
                                        // });
                                        onSelectEntity?.({
                                            id: item.source,
                                            title: item.sourceLabel,
                                            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                        });
                                    }}
                                >
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            fixed: 'right',
            render: (views: number) => (
                <Typography.Text>
                    {views ? views.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
        <>
            <Card className={className}>
                <div className="mb-4 flex items-center gap-2">
                    <AppSearch
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                        style={{ width: 200 }}
                    />
                    <Segmented
                        value={selectedReleaseType}
                        onChange={(value) => {
                            const selectedType =
                                value as ANALYTICS_RELEASE_TYPE;
                            setSelectedReleaseType(selectedType);
                            onChangeFilter({
                                releaseType:
                                    selectedType === ANALYTICS_RELEASE_TYPE.ALL
                                        ? undefined
                                        : selectedType,
                            });
                        }}
                        options={[
                            {
                                label: messages('common.all'),
                                value: ANALYTICS_RELEASE_TYPE.ALL,
                            },
                            {
                                label: messages('common.audio'),
                                value: ANALYTICS_RELEASE_TYPE.AUDIO,
                            },
                            {
                                label: messages('common.video'),
                                value: ANALYTICS_RELEASE_TYPE.VIDEO,
                            },
                        ]}
                    />
                    <Segmented
                        value={
                            isRevenue
                                ? ANALYTICS_VIEW_TYPE.REVENUE
                                : ANALYTICS_VIEW_TYPE.VIEW
                        }
                        onChange={(value) => {
                            const nextType = value as ANALYTICS_VIEW_TYPE;
                            setCurrentType(nextType);
                            // The metric owns the view type when it is
                            // controlled; writing both params would race two
                            // URL updates built from the same stale snapshot.
                            if (onMetricChange) {
                                onMetricChange(
                                    nextType === ANALYTICS_VIEW_TYPE.VIEW
                                        ? ANALYTICS_METRIC_KEY.TOTAL_VIEWS
                                        : ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
                                );
                                return;
                            }
                            onChangeFilter({ type: nextType });
                        }}
                        options={[
                            {
                                label: messages('common.views'),
                                value: ANALYTICS_VIEW_TYPE.VIEW,
                            },
                            {
                                label: messages('common.revenue'),
                                value: ANALYTICS_VIEW_TYPE.REVENUE,
                            },
                        ]}
                    />
                </div>
                {isRevenue ? (
                    <Table<RevenueDspItem & { rank: number }>
                        sticky
                        size="small"
                        columns={revenueColumns}
                        dataSource={revenueDataWithRank}
                        loading={isFetching}
                        rowKey="source"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                ) : (
                    <Table<DspRankingItem & { rank: number }>
                        sticky
                        size="small"
                        columns={viewsColumns}
                        dataSource={viewsDataWithRank}
                        loading={isFetching}
                        rowKey="source"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                )}
                <AppPagination
                    align="end"
                    className="!mt-4"
                    current={page}
                    pageSize={pageSize}
                    total={
                        isRevenue
                            ? topDspData?.metadata?.totalItems || 0
                            : dspRankingData?.metadata?.totalItems || 0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </Card>

            {detailSourceModal.open && (
                <DetailSourceTypeAnalyticsModal
                    open={detailSourceModal.open}
                    onClose={() =>
                        setDetailSourceModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailSourceModal.title}
                    sourceType={detailSourceModal.sourceType}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}
        </>
    );
}
