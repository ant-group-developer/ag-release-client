'use client';

import RevenueMetricCards from './revenue-metric-cards';
import RevenueTimelineChart from './revenue-timeline-chart';
import RevenueHorizontalBarChart from './revenue-horizontal-bar-chart';
import {
    useGetRevenueTopArtist,
    useGetRevenueTopTrack,
} from '../hooks/use-get-revenue-data';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueTabContent({ fromDate, toDate }: Props) {
    const { topArtistData, isFetching: isArtistsLoading } = useGetRevenueTopArtist({
        fromDate,
        toDate,
        topN: 10,
        includeOther: true,
    });

    const { topTrackData, isFetching: isTracksLoading } = useGetRevenueTopTrack({
        fromDate,
        toDate,
        topN: 10,
        includeOther: true,
    });

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Overview Metric Cards */}
            <RevenueMetricCards fromDate={fromDate} toDate={toDate} />

            {/* 2. Stacked Bar Chart */}
            <RevenueTimelineChart fromDate={fromDate} toDate={toDate} />

            {/* 3. Top Rankings (Artists & Tracks Side-by-Side) */}
            <div className="flex flex-col lg:flex-row gap-6">
                <RevenueHorizontalBarChart
                    title="TOP 10 REVENUE ARTISTS"
                    data={topArtistData}
                    labelKey="artistName"
                    valueKey="revenueUsd"
                    isLoading={isArtistsLoading}
                />
                <RevenueHorizontalBarChart
                    title="TOP 10 HIGHEST REVENUE TRACKS"
                    data={topTrackData}
                    labelKey="title"
                    valueKey="revenueUsd"
                    isLoading={isTracksLoading}
                />
            </div>
        </div>
    );
}
