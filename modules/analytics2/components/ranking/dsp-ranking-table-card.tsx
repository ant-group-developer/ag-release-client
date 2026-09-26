'use client';

import AppPagination from '@/components/ui/pagination';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { ContentItem } from '@/modules/analytics2/components/modal/advanced-mode/content-entity-selector';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
} from '@/modules/analytics2/constants/types';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    ANALYTICS_DSP_SELECTION_SEPARATOR,
    getAnalyticsDspSelectionKey,
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
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { CommonParams } from '@/types/api';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, Grid, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import RankingTableFilter from './ranking-table-filter';

const DEFAULT_PAGE = 1;

export interface DspRankingTableCardProps {
    dspId?: string;
    pgDspId?: string;
    dspReportId?: string;
    dspReportIds?: string[];
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey?: ANALYTICS_METRIC_KEY;
    onMetricChange?: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    selectedRowKeys?: string[];
    onSelectedRowKeysChange?: (keys: string[]) => void;
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
    pgDspId,
    dspReportId,
    dspReportIds,
    scopeParams,
    fromDate,
    toDate,
    releaseType,
    metricKey,
    onMetricChange,
    onSelectEntity,
    selectedRowKeys,
    onSelectedRowKeysChange,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: DspRankingTableCardProps) {
    const messages = useTranslations();

    const screens = Grid.useBreakpoint();
    const isMobile = screens.md === false;
    const fixedLeft = isMobile ? undefined : 'left';
    const fixedRight = isMobile ? undefined : 'right';

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

    const getDspRowKey = (record: DspRankingItem | RevenueDspItem) =>
        getAnalyticsDspSelectionKey(record) ||
        `unselectable-${record.source || record.dspName || 'unknown'}`;

    const dspRowSelection = onSelectedRowKeysChange
        ? {
              selectedRowKeys,
              preserveSelectedRowKeys: true,
              getCheckboxProps: (record: DspRankingItem | RevenueDspItem) => ({
                  disabled: !getAnalyticsDspSelectionKey(record),
              }),
              onChange: (keys: React.Key[]) =>
                  onSelectedRowKeysChange(
                      keys
                          .map(String)
                          .filter((key) =>
                              key.includes(ANALYTICS_DSP_SELECTION_SEPARATOR)
                          )
                  ),
          }
        : undefined;

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
            ...(pgDspId ? { pgDspId } : {}),
            ...(dspReportIds?.length ? { dspReportIds } : {}),
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
            ...(pgDspId ? { pgDspId } : {}),
            ...(dspReportIds?.length ? { dspReportIds } : {}),
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

    const renderDspName = (
        record: (RevenueDspItem | DspRankingItem) & { rank: number }
    ) => (
        <div className="flex items-center gap-3">
            <ReleaseCoverImage
                width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                src={record.imageUrl}
            />
            <CustomTooltip title={messages('common.detailedAnalysis')}>
                <Typography.Text
                    className="cursor-pointer truncate transition-colors hover:text-blue-500"
                    onClick={() => {
                        const dspId =
                            record.pgDspId ||
                            record.dspReportId ||
                            record.source ||
                            record.dspName ||
                            '';
                        const dspTitle =
                            record.dspName ||
                            record.sourceLabel ||
                            record.source ||
                            '';
                        onSelectEntity?.({
                            id: dspId,
                            entitySubId: record.dspReportId,
                            dspReportIds: record.dspReportIds,
                            title: dspTitle,
                            type: ANALYTICS_ENTITY_TYPE.DSP,
                            thumbnailUrl: record.imageUrl ?? undefined,
                        });
                    }}
                >
                    {record.dspName || '—'}
                </Typography.Text>
            </CustomTooltip>
        </div>
    );

    const revenueColumns: ProColumns<RevenueDspItem & { rank: number }>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('dsp.name'),
            dataIndex: 'sourceLabel',
            key: 'sourceLabel',
            width: 250,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record) => renderDspName(record),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (_, record) => {
                const bySource = record.bySource;
                if (!bySource || bySource.length === 0) return '— ';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item: BySourceItem) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
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
            fixed: fixedRight,
            render: (_, record) => (
                <Typography.Text type="secondary">
                    {record.quantity ? record.quantity.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 180,
            fixed: fixedRight,
            render: (_, record) => (
                <Typography.Text>
                    $
                    {record.revenueUsd
                        ? formattedNumber(record.revenueUsd)
                        : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewsColumns: ProColumns<DspRankingItem & { rank: number }>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('dsp.name'),
            dataIndex: 'sourceLabel',
            key: 'sourceLabel',
            width: 250,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record) => renderDspName(record),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (_, record) => {
                const bySource = record.bySource;
                if (!bySource || bySource.length === 0) return '— ';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item: BySourceItem) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
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
            fixed: fixedRight,
            render: (_, record) => (
                <Typography.Text>
                    {record.totalViews ? record.totalViews.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
        <Card className={className}>
            <RankingTableFilter
                keyword={dataFilter.keyword}
                onSearch={onSearch}
                showReleaseType
                releaseType={selectedReleaseType}
                onReleaseTypeChange={(selectedType) => {
                    setSelectedReleaseType(selectedType);
                    onChangeFilter({
                        releaseType:
                            selectedType === ANALYTICS_RELEASE_TYPE.ALL
                                ? undefined
                                : selectedType,
                    });
                }}
                showMetricType
                metricType={
                    isRevenue
                        ? ANALYTICS_VIEW_TYPE.REVENUE
                        : ANALYTICS_VIEW_TYPE.VIEW
                }
                onMetricTypeChange={(nextType) => {
                    setCurrentType(nextType);
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
            />
            {isRevenue ? (
                <AppProTable<RevenueDspItem & { rank: number }>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={revenueColumns}
                    dataSource={revenueDataWithRank}
                    loading={isFetching}
                    rowKey={getDspRowKey}
                    rowSelection={dspRowSelection}
                    pagination={false}
                    search={false}
                    scroll={{ x: SCREEN.LG }}
                />
            ) : (
                <AppProTable<DspRankingItem & { rank: number }>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={viewsColumns}
                    dataSource={viewsDataWithRank}
                    loading={isFetching}
                    rowKey={getDspRowKey}
                    rowSelection={dspRowSelection}
                    pagination={false}
                    search={false}
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
    );
}
