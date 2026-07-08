'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { SIZE_ICON } from '@/constants/common';
import { ANALYTIC_SORT_BY } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { Col, Row, Segmented, Space, Tag } from 'antd';
import { DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetTrackDsp } from '../../hooks/use-get-track-dsp';
import { useGetTrackOverview } from '../../hooks/use-get-track-overview';
import { useGetTrackRevenueLineChart } from '../../hooks/use-get-track-revenue-line-chart';
import { useGetTrackTer } from '../../hooks/use-get-track-ter';
import { useGetTrackTrendViewLineChart } from '../../hooks/use-get-track-trend-view-line-chart';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import LineChartView from '../chart/line-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailTrackAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    isrc: string;
    fromDate: string;
    toDate: string;
}

export default function DetailTrackAnalyticsModal({
    open,
    onClose,
    title,
    isrc,
    fromDate,
    toDate,
}: DetailTrackAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [lineChartViewType, setLineChartViewType] = useState<
        'views' | 'revenue'
    >('views');

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan của Track
    const { overviewData, isFetching } = useGetTrackOverview(isrc, {
        fromDate: localFromDate,
        toDate: localToDate,
    });

    // Gọi API lấy thông tin biểu đồ doanh thu của Track
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetTrackRevenueLineChart(
            isrc,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Track
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetTrackTrendViewLineChart(isrc, {
        fromDate: localFromDate,
        toDate: localToDate,
    });

    const [dspSortBy, setDspSortBy] = useState<ANALYTIC_SORT_BY>(
        ANALYTIC_SORT_BY.REVENUE
    );

    // Gọi API lấy danh sách DSP chi tiết phân trang của Track
    const { trackDspData, isFetching: isTrackDspFetching } = useGetTrackDsp(
        isrc,
        {
            fromDate: localFromDate,
            toDate: localToDate,
            sortBy: dspSortBy,
            topN: 5,
            includeOther: true,
        }
    );

    const [terSortBy, setTerSortBy] = useState<ANALYTIC_SORT_BY>(
        ANALYTIC_SORT_BY.REVENUE
    );

    // Gọi API lấy danh sách Territory chi tiết phân trang của Track
    const { trackTerData, isFetching: isTrackTerFetching } = useGetTrackTer(
        isrc,
        {
            fromDate: localFromDate,
            toDate: localToDate,
            sortBy: terSortBy,
            topN: 5,
            includeOther: true,
        }
    );

    const trackDspColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 120,
                align: 'center' as const,
                render: (rank: number) => (
                    <span className="text-gray-700 dark:text-zinc-300">
                        #{rank}
                    </span>
                ),
            },
            {
                title: 'DSP',
                dataIndex: 'dspName',
                key: 'dspName',
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 180,
                sorter: true,
                sortOrder:
                    dspSortBy === ANALYTIC_SORT_BY.VIEWS
                        ? ('descend' as const)
                        : undefined,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 180,
                sorter: true,
                sortOrder:
                    dspSortBy === ANALYTIC_SORT_BY.REVENUE
                        ? ('descend' as const)
                        : undefined,
                render: (val: string) => {
                    const numVal = parseFloat(val);
                    return (
                        <span className="text-gray-900 dark:text-zinc-100">
                            ${isNaN(numVal) ? '0.00' : formattedNumber(numVal)}
                        </span>
                    );
                },
            },
        ],
        [messages, dspSortBy]
    );

    const trackTerColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 120,
                align: 'center' as const,
                render: (rank: number) => (
                    <span className="text-gray-700 dark:text-zinc-300">
                        #{rank}
                    </span>
                ),
            },
            {
                title: messages('country.label'),
                dataIndex: 'territory',
                key: 'territory',
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 180,
                sorter: true,
                sortOrder:
                    terSortBy === ANALYTIC_SORT_BY.VIEWS
                        ? ('descend' as const)
                        : undefined,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 180,
                sorter: true,
                sortOrder:
                    terSortBy === ANALYTIC_SORT_BY.REVENUE
                        ? ('descend' as const)
                        : undefined,
                render: (val: string) => {
                    const numVal = parseFloat(val);
                    return (
                        <span className="text-gray-900 dark:text-zinc-100">
                            ${isNaN(numVal) ? '0.00' : formattedNumber(numVal)}
                        </span>
                    );
                },
            },
        ],
        [messages, terSortBy]
    );

    const mappedTrackDspData = useMemo(() => {
        return (trackDspData.items || []).map((item: any) => ({
            ...item,
            totalRevenueUsdNum: parseFloat(item.totalRevenueUsd) || 0,
        }));
    }, [trackDspData.items]);

    const mappedTrackTerData = useMemo(() => {
        return (trackTerData.items || []).map((item: any) => ({
            ...item,
            totalRevenueUsdNum: parseFloat(item.totalRevenueUsd) || 0,
        }));
    }, [trackTerData.items]);

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('common.track')}
                        </Tag>
                        <span className="">{`${messages('analytics.label')}: ${title}`}</span>
                    </Space>
                    <DateSelect2
                        style={{ width: 240, height: 32 }}
                        value={`${localFromDate},${localToDate}`}
                        onChange={(value) => {
                            const [startDate, endDate] = value
                                .toString()
                                .split(',');
                            setLocalFromDate(startDate);
                            setLocalToDate(endDate);
                        }}
                    />
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="space-y-6 p-6">
                {/* 1. Phần overview 3 card */}
                <DetailStatsOverview
                    trendViews={overviewData?.totalTrendViews}
                    salesViews={overviewData?.totalSalesViews}
                    revenueUsd={overviewData?.totalRevenueUsd}
                    isLoading={isFetching}
                />

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={24}>
                        <LineChartView
                            title={
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                                        {lineChartViewType === 'views'
                                            ? messages(
                                                  'analytics.trendViewsByMonth'
                                              )
                                            : messages(
                                                  'analytics.totalRevenueByMonth'
                                              )}
                                    </span>
                                    <Segmented
                                        options={[
                                            {
                                                label: (
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye size={SIZE_ICON} />
                                                        <span>
                                                            {messages(
                                                                'common.views'
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                                value: 'views',
                                            },
                                            {
                                                label: (
                                                    <div className="flex items-center gap-1.5">
                                                        <DollarSign
                                                            size={SIZE_ICON}
                                                        />
                                                        <span>
                                                            {messages(
                                                                'common.revenue'
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                                value: 'revenue',
                                            },
                                        ]}
                                        value={lineChartViewType}
                                        onChange={(val) =>
                                            setLineChartViewType(
                                                val as 'views' | 'revenue'
                                            )
                                        }
                                        className="flex-shrink-0"
                                    />
                                </div>
                            }
                            data={
                                lineChartViewType === 'views'
                                    ? trendViewLineChartData
                                    : revenueLineChartData
                            }
                            xAxisKey="period"
                            lineKey={
                                lineChartViewType === 'views'
                                    ? 'totalViews'
                                    : 'revenueUsd'
                            }
                            lineName={
                                lineChartViewType === 'views'
                                    ? messages('common.viewCount')
                                    : messages('analytics.revenue.modeRevenue')
                            }
                            loading={
                                lineChartViewType === 'views'
                                    ? isTrendViewLineChartFetching
                                    : isLineChartFetching
                            }
                            chartHeight={250}
                            valuePrefix={
                                lineChartViewType === 'revenue'
                                    ? '$'
                                    : undefined
                            }
                            additionalTooltipKeys={
                                lineChartViewType === 'revenue'
                                    ? [
                                          {
                                              key: 'quantity',
                                              name: messages(
                                                  'analytics.revenue.usage'
                                              ),
                                          },
                                      ]
                                    : undefined
                            }
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={
                                dspSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? messages('analytics.dspDistribution')
                                    : messages(
                                          'analytics.revenueDspDistribution'
                                      )
                            }
                            columns={trackDspColumns}
                            dataSource={mappedTrackDspData}
                            loading={isTrackDspFetching}
                            rowKey="dspName"
                            labelKey="dspName"
                            defaultView={RankingCardView.LIST}
                            valueKey={
                                dspSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? 'totalViews'
                                    : 'totalRevenueUsdNum'
                            }
                            valuePrefix={
                                dspSortBy === ANALYTIC_SORT_BY.REVENUE
                                    ? '$'
                                    : undefined
                            }
                            onChange={(pagination, filters, sorter: any) => {
                                const field = sorter.field;
                                if (field === 'totalViews') {
                                    setDspSortBy(ANALYTIC_SORT_BY.VIEWS);
                                } else if (field === 'totalRevenueUsd') {
                                    setDspSortBy(ANALYTIC_SORT_BY.REVENUE);
                                }
                            }}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={
                                terSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? messages('analytics.terDistribution')
                                    : messages(
                                          'analytics.revenueTerDistribution'
                                      )
                            }
                            columns={trackTerColumns}
                            dataSource={mappedTrackTerData}
                            loading={isTrackTerFetching}
                            rowKey="territory"
                            labelKey="territory"
                            defaultView={RankingCardView.LIST}
                            valueKey={
                                terSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? 'totalViews'
                                    : 'totalRevenueUsdNum'
                            }
                            valuePrefix={
                                terSortBy === ANALYTIC_SORT_BY.REVENUE
                                    ? '$'
                                    : undefined
                            }
                            onChange={(pagination, filters, sorter: any) => {
                                const field = sorter.field;
                                if (field === 'totalViews') {
                                    setTerSortBy(ANALYTIC_SORT_BY.VIEWS);
                                } else if (field === 'totalRevenueUsd') {
                                    setTerSortBy(ANALYTIC_SORT_BY.REVENUE);
                                }
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
