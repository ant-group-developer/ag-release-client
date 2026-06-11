'use client';

import RevenueMetricCards from '../card/revenue-metric-cards';
import RevenueTimelineChart from '../chart/revenue-timeline-chart';
import RevenueRankings from '../ranking/revenue-rankings';


interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueTabContent({ fromDate, toDate }: Props) {
    return (
        <>
            {/* 1. Overview Metric Cards */}
            <RevenueMetricCards fromDate={fromDate} toDate={toDate} />

            {/* 2. Stacked Bar Chart */}
            <RevenueTimelineChart fromDate={fromDate} toDate={toDate} />

            {/* 3. Top Rankings */}
            <RevenueRankings fromDate={fromDate} toDate={toDate} />
        </>
    );
}
