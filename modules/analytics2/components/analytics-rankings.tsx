'use client';

import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    useGetArtistRanking,
    useGetLabelRanking,
    useGetReleaseRanking,
    useGetTrackRanking,
} from '../hooks/use-get-rankings';
import { useGetTerTimeline } from '../hooks/use-get-ter-timeline';
import {
    ArtistRankingItem,
    LabelRankingItem,
    ReleaseRankingItem,
    TrackRankingItem,
} from '../types';
import RankingCard, { RankingCardView } from './ranking-card';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function AnalyticsRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;

    // Fetch live ranking data
    const { trackRankingData, isFetching: isTracksFetching } =
        useGetTrackRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { releaseRankingData, isFetching: isReleasesFetching } =
        useGetReleaseRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { artistRankingData, isFetching: isArtistsFetching } =
        useGetArtistRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { labelRankingData, isFetching: isLabelsFetching } =
        useGetLabelRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { timelineData: terTimelineData, isFetching: isTerFetching } =
        useGetTerTimeline({
            fromDate,
            toDate,
            topN,
            includeOther: true,
        });

    const territoryRankingData = useMemo(() => {
        if (!terTimelineData?.items) return [];

        const totals: Record<string, number> = {};
        terTimelineData.items.forEach((item) => {
            item.series.forEach((s) => {
                const name = s.territory || 'Other';
                totals[name] = (totals[name] ?? 0) + s.trendViews;
            });
        });

        return Object.entries(totals)
            .map(([territory, totalViews]) => ({
                territory,
                totalViews,
            }))
            .sort((a, b) => b.totalViews - a.totalViews)
            .map((item, index) => ({
                rank: index + 1,
                ...item,
            }));
    }, [terTimelineData]);

    // Columns config
    const trackColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            fixed: 'left' as const,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.track'),
            dataIndex: 'title',
            key: 'title',
            width: 130,
            ellipsis: true,
            fixed: 'left' as const,
            render: (text: string, record: TrackRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={32}
                        height={32}
                        data={{ id: record.releaseId } as any}
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                            {text}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            width: 90,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 85,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'releaseTitle',
            key: 'releaseTitle',
            width: 85,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 70,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const releaseColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            fixed: 'left' as const,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 130,
            ellipsis: true,
            fixed: 'left' as const,
            render: (text: string, record: ReleaseRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={32}
                        height={32}
                        data={{ id: record.releaseId } as any}
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                            {text}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 90,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 95,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 65,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 70,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const artistColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            fixed: 'left' as const,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            width: 200,
            ellipsis: true,
            fixed: 'left' as const,
            render: (text: string, record: ArtistRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={32}
                        height={32}
                        data={{ id: record.picture } as any}
                    />
                    <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 125,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 125,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const labelColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            fixed: 'left' as const,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 200,
            ellipsis: true,
            fixed: 'left' as const,
            render: (text: string, record: LabelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={32}
                        height={32}
                        data={{ id: record.labelId } as any}
                    />
                    <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: 80,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 80,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 90,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const territoryColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            fixed: 'left' as const,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.region'),
            dataIndex: 'territory',
            key: 'territory',
            width: 200,
            ellipsis: true,
            fixed: 'left' as const,
            render: (text: string) => (
                <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                    {text}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 125,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    return (
        <div className="mt-4 flex flex-col gap-6">
            <Row gutter={[24, 24]}>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={messages('common.tracks')}
                        columns={trackColumns}
                        dataSource={trackRankingData}
                        loading={isTracksFetching}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={messages('common.releases')}
                        columns={releaseColumns}
                        dataSource={releaseRankingData}
                        loading={isReleasesFetching}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={messages('common.partners')}
                        columns={artistColumns}
                        dataSource={artistRankingData}
                        loading={isArtistsFetching}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="totalViews"
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={'Labels'}
                        columns={labelColumns}
                        dataSource={labelRankingData}
                        loading={isLabelsFetching}
                        rowKey="labelId"
                        labelKey="labelName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={messages('common.region')}
                        columns={territoryColumns}
                        dataSource={territoryRankingData}
                        loading={isTerFetching}
                        rowKey="territory"
                        labelKey="territory"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                    />
                </Col>
            </Row>
        </div>
    );
}
