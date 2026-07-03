'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { SIZE_ICON } from '@/constants/common';
import { Col, Row, Segmented, Space, Tag } from 'antd';
import { DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetDspOverview } from '../../hooks/use-get-dsp-overview';
import { useGetDspRevenueTenantBarChart } from '../../hooks/use-get-dsp-revenue-tenant-bar-chart';
import { useGetDspRevenueLineChart } from '../../hooks/use-get-dsp-revenue-line-chart';
import { useGetDspRevenueTerBarChart } from '../../hooks/use-get-dsp-revenue-ter-bar-chart';
import { useGetDspTrendViewTenantBarChart } from '../../hooks/use-get-dsp-trend-view-tenant-bar-chart';
import { useGetDspTrendViewLineChart } from '../../hooks/use-get-dsp-trend-view-line-chart';
import { useGetDspTrendViewTerBarChart } from '../../hooks/use-get-dsp-trend-view-ter-bar-chart';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import LineChartView from '../chart/line-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';
import { formattedNumber } from '@/helpers/common';

interface DetailDspAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    pgDspId: string;
    dspReportId: string;
    fromDate: string;
    toDate: string;
}

export default function DetailDspAnalyticsModal({
    open,
    onClose,
    title,
    pgDspId,
    dspReportId,
    fromDate,
    toDate,
}: DetailDspAnalyticsModalProps) {
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

    // Gọi API lấy thông tin tổng quan của DSP
    const { overviewData, isFetching } = useGetDspOverview(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin biểu đồ doanh thu của DSP
    const { lineChartData: revenueLineChartData, isFetching: isLineChartFetching } =
        useGetDspRevenueLineChart(
            { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của DSP
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetDspTrendViewLineChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo Tenant/Workspace của DSP
    const {
        tenantBarChartData: trendViewTenantBarChartData,
        isFetching: isTrendViewTenantBarChartFetching,
    } = useGetDspTrendViewTenantBarChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của DSP
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetDspTrendViewTerBarChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố doanh thu theo Tenant/Workspace của DSP
    const { tenantBarChartData: revenueTenantBarChartData, isFetching: isRevenueTenantBarChartFetching } =
        useGetDspRevenueTenantBarChart(
            { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của DSP
    const { terBarChartData: revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetDspRevenueTerBarChart(
            { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
            open
        );

    const tenantColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
                align: 'center' as const,
                render: (rank: number) => (
                    <span className="text-gray-700 dark:text-zinc-300">
                        #{rank}
                    </span>
                ),
            },
            {
                title: messages('tenant.label'),
                dataIndex: 'tenantName',
                key: 'tenantName',
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
                width: 150,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const terColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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
                width: 150,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const mappedTrendTenantRankData = useMemo(() => {
        return trendViewTenantBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [trendViewTenantBarChartData]);

    const mappedTrendTerRankData = useMemo(() => {
        return trendViewTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [trendViewTerBarChartData]);

    const revenueTenantColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
                align: 'center' as const,
                render: (rank: number) => (
                    <span className="text-gray-700 dark:text-zinc-300">
                        #{rank}
                    </span>
                ),
            },
            {
                title: messages('tenant.label'),
                dataIndex: 'tenantName',
                key: 'tenantName',
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 150,
                render: (val: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const revenueTerColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 150,
                render: (val: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const mappedRevenueTenantRankData = useMemo(() => {
        return revenueTenantBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [revenueTenantBarChartData]);

    const mappedRevenueTerRankData = useMemo(() => {
        return revenueTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [revenueTerBarChartData]);

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('dsp.label')}
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
                            title={messages('analytics.tenantDistribution')}
                            columns={tenantColumns}
                            dataSource={mappedTrendTenantRankData}
                            loading={isTrendViewTenantBarChartFetching}
                            rowKey="tenantName"
                            labelKey="tenantName"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.revenueTenantDistribution')}
                            columns={revenueTenantColumns}
                            dataSource={mappedRevenueTenantRankData}
                            loading={isRevenueTenantBarChartFetching}
                            rowKey="tenantName"
                            labelKey="tenantName"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            valuePrefix="$"
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.terDistribution')}
                            columns={terColumns}
                            dataSource={mappedTrendTerRankData}
                            loading={isTrendViewTerBarChartFetching}
                            rowKey="territory"
                            labelKey="territory"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.revenueTerDistribution')}
                            columns={revenueTerColumns}
                            dataSource={mappedRevenueTerRankData}
                            loading={isRevenueTerBarChartFetching}
                            rowKey="territory"
                            labelKey="territory"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            valuePrefix="$"
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
