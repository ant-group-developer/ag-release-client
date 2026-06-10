'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    useGetArtistRanking,
    useGetLabelRanking,
    useGetReleaseRanking,
    useGetTrackRanking,
} from '../../hooks/use-get-rankings';
import { useGetTerTimeline } from '../../hooks/use-get-ter-timeline';
import {
    ArtistRankingItem,
    LabelRankingItem,
    ReleaseRankingItem,
    TrackRankingItem,
} from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function AnalyticsRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;
    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
        });
    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        releaseId: string;
    }>({
        open: false,
        title: '',
        releaseId: '',
    });
    const [trackDetailModal, setTrackDetailModal] = useState<{
        open: boolean;
        title: string;
        isrc: string;
    }>({
        open: false,
        title: '',
        isrc: '',
    });
    const [labelDetailModal, setLabelDetailModal] = useState<{
        open: boolean;
        title: string;
        labelId: string;
    }>({
        open: false,
        title: '',
        labelId: '',
    });
    const [artistDetailModal, setArtistDetailModal] = useState<{
        open: boolean;
        title: string;
        artistId: string;
    }>({
        open: false,
        title: '',
        artistId: '',
    });
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
            title: messages('analytics2.rank'),
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
                        fileId={
                            record?.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setTrackDetailModal({
                                        open: true,
                                        title: text,
                                        isrc: record.isrc,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        // {
        //     title: messages('common.artist'),
        //     dataIndex: 'artistName',
        //     key: 'artistName',
        //     width: 90,
        //     ellipsis: true,
        //     render: (text: string) => (
        //         <span className="truncate text-gray-600 dark:text-zinc-400">
        //             {text || '—'}
        //         </span>
        //     ),
        // },
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
        // {
        //     title: messages('common.release'),
        //     dataIndex: 'releaseTitle',
        //     key: 'releaseTitle',
        //     width: 85,
        //     ellipsis: true,
        //     render: (text: string) => (
        //         <span className="truncate text-gray-600 dark:text-zinc-400">
        //             {text || '—'}
        //         </span>
        //     ),
        // },
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
            title: messages('analytics2.rank'),
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
                        fileId={
                            record.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        open: true,
                                        title: text,
                                        releaseId: record.releaseId,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        // {
        //     title: messages('common.label'),
        //     dataIndex: 'labelName',
        //     key: 'labelName',
        //     width: 90,
        //     ellipsis: true,
        //     render: (text: string) => (
        //         <span className="truncate text-gray-600 dark:text-zinc-400">
        //             {text || '—'}
        //         </span>
        //     ),
        // },
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
            title: messages('analytics2.rank'),
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
                        src={record.picture}
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setArtistDetailModal({
                                    open: true,
                                    title: text,
                                    artistId: record.artistId,
                                })
                            }
                        >
                            {text}
                        </span>
                    </CustomTooltip>
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
            title: messages('analytics2.rank'),
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
                        src={record.picture}
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setLabelDetailModal({
                                    open: true,
                                    title: text,
                                    labelId: record.labelId,
                                })
                            }
                        >
                            {text}
                        </span>
                    </CustomTooltip>
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
            title: messages('analytics2.rank'),
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
                        title={topRankingTitle(messages('common.tracks'))}
                        columns={trackColumns}
                        dataSource={trackRankingData}
                        loading={isTracksFetching}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.releases'))}
                        columns={releaseColumns}
                        dataSource={releaseRankingData}
                        loading={isReleasesFetching}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.partners'))}
                        columns={artistColumns}
                        dataSource={artistRankingData}
                        loading={isArtistsFetching}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.labels'))}
                        columns={labelColumns}
                        dataSource={labelRankingData}
                        loading={isLabelsFetching}
                        rowKey="labelId"
                        labelKey="labelName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                {/* <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.region'))}
                        columns={territoryColumns}
                        dataSource={territoryRankingData}
                        loading={isTerFetching}
                        rowKey="territory"
                        labelKey="territory"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                    />
                </Col> */}
            </Row>
            <DetailReleaseAnalyticsModal
                open={detailModal.open}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, open: false }))
                }
                title={detailModal.title}
                releaseId={detailModal.releaseId}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailTrackAnalyticsModal
                open={trackDetailModal.open}
                onClose={() =>
                    setTrackDetailModal((prev) => ({ ...prev, open: false }))
                }
                title={trackDetailModal.title}
                isrc={trackDetailModal.isrc}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailLabelAnalyticsModal
                open={labelDetailModal.open}
                onClose={() =>
                    setLabelDetailModal((prev) => ({ ...prev, open: false }))
                }
                title={labelDetailModal.title}
                labelId={labelDetailModal.labelId}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailArtistAnalyticsModal
                open={artistDetailModal.open}
                onClose={() =>
                    setArtistDetailModal((prev) => ({ ...prev, open: false }))
                }
                title={artistDetailModal.title}
                artistId={artistDetailModal.artistId}
                fromDate={fromDate}
                toDate={toDate}
            />
        </div>
    );
}
