'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useGetTrackOverview } from '../../hooks/use-get-track-overview';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
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
    const [range, setRange] = useState<number>(30);

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan của Track
    const { overviewData, isFetching } = useGetTrackOverview(
        isrc,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-gray-900 dark:text-zinc-100">
                            {messages('analytics.detailTitle')}
                        </span>
                        <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                            {messages('analytics2.detailEntityTitle', {
                                entity: messages('common.track'),
                                title,
                            })}
                        </span>
                    </div>
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
                    <Col xs={24} lg={15}>
                        <LineChartView
                            title={messages('analytics.totalTrendViews')}
                            data={[]}
                            xAxisKey="period"
                            lineKey="totalViews"
                            lineName={messages('common.viewCount')}
                            loading={true}
                            chartHeight={250}
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <PieChartView
                            title={
                                <Select
                                    variant="borderless"
                                    value={'dsp'}
                                    onChange={() => {}}
                                    options={[
                                        {
                                            value: 'dsp',
                                            label: (
                                                <Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.dspDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.terDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                    ]}
                                    className="w-[200px]"
                                />
                            }
                            data={[]}
                            loading={true}
                            legendPosition="right"
                            chartHeight={200}
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={15}>
                        <LineChartView
                            title={messages('analytics.totalRevenueUsd')}
                            data={[]}
                            xAxisKey="period"
                            lineKey="totalViews"
                            lineName={messages('common.viewCount')}
                            loading={true}
                            chartHeight={250}
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <PieChartView
                            title={
                                <Select
                                    variant="borderless"
                                    value={'dsp'}
                                    onChange={() => {}}
                                    options={[
                                        {
                                            value: 'dsp',
                                            label: (
                                                <Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.dspDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.terDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                    ]}
                                    className="w-[200px]"
                                />
                            }
                            data={[]}
                            loading={true}
                            legendPosition="right"
                            chartHeight={200}
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
