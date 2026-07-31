'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { ANALYTIC_SORT_BY } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '../../constants/types';
import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { createViewMoreHref } from '../../helpers';
import { useGetSourceTypeTopReleases } from '../../hooks/use-get-source-type-top-releases';
import { useGetSourceTypeTopTracks } from '../../hooks/use-get-source-type-top-tracks';
import { ReleaseRankingItem, TrackRankingItem } from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';

interface DetailSourceTypeRankingsProps {
    sourceType: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    sortBy?: string;
    enabled?: boolean;
    onSelectRelease: (releaseId: string, title: string, upc?: string) => void;
    onSelectTrack: (isrc: string, title: string) => void;
}

export default function DetailSourceTypeRankings({
    sourceType,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    sortBy,
    enabled = true,
    onSelectRelease,
    onSelectTrack,
}: DetailSourceTypeRankingsProps) {
    const messages = useTranslations();

    const currentSortBy = useMemo(() => {
        if (sortBy) return sortBy;
        if (activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE) {
            return ANALYTIC_SORT_BY.USAGE;
        }
        if (activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD) {
            return ANALYTIC_SORT_BY.REVENUE;
        }
        return ANALYTIC_SORT_BY.VIEWS;
    }, [activeMetric, sortBy]);

    // 1. Top Releases API
    const { sourceTypeTopReleasesData, isFetching: isTopReleasesFetching } =
        useGetSourceTypeTopReleases(
            sourceType,
            {
                fromDate,
                toDate,
                topN: 5,
                includeOther: false,
                releaseType,
                sortBy: currentSortBy,
            },
            { enabled }
        );

    // 2. Top Tracks API
    const { sourceTypeTopTracksData, isFetching: isTopTracksFetching } =
        useGetSourceTypeTopTracks(
            sourceType,
            {
                fromDate,
                toDate,
                topN: 5,
                includeOther: false,
                releaseType,
                sortBy: currentSortBy,
            },
            { enabled }
        );

    const releaseColumns = useMemo(
        () => [
            {
                title: messages('common.release'),
                dataIndex: 'title',
                key: 'title',
                ellipsis: true,
                render: (text: string, record: ReleaseRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            fileId={
                                record.release?.coverArtThumbnails?.[
                                    RELEASE_COVER_ART_SIZE.S75
                                ] as string
                            }
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    onSelectRelease(
                                        record.releaseId,
                                        text,
                                        record.upc
                                    )
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.streams'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 100,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: 'Total Usage',
                dataIndex: 'totalUsage',
                key: 'totalUsage',
                width: 100,
                render: (usage: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {usage ? usage.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 110,
                render: (val: string | number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(Number(val)) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, onSelectRelease]
    );

    const trackColumns = useMemo(
        () => [
            {
                title: messages('track.label'),
                dataIndex: 'title',
                key: 'title',
                ellipsis: true,
                render: (text: string, record: TrackRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            fileId={
                                record.release?.coverArtThumbnails?.[
                                    RELEASE_COVER_ART_SIZE.S75
                                ] as string
                            }
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() => onSelectTrack(record.isrc, text)}
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.streams'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 100,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: 'Total Usage',
                dataIndex: 'totalUsage',
                key: 'totalUsage',
                width: 100,
                render: (usage: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {usage ? usage.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 110,
                render: (val: string | number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(Number(val)) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, onSelectTrack]
    );

    return (
        <div className="space-y-6">
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <RankingCard
                        title={messages('analytics2.topReleases')}
                        columns={releaseColumns}
                        dataSource={sourceTypeTopReleasesData?.items ?? []}
                        loading={isTopReleasesFetching}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_RELEASES,
                            { fromDate, toDate, sourceType }
                        )}
                    />
                </Col>

                <Col xs={24} lg={12}>
                    <RankingCard
                        title={messages('analytics2.topTracks')}
                        columns={trackColumns}
                        dataSource={sourceTypeTopTracksData?.items ?? []}
                        loading={isTopTracksFetching}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_TRACKS,
                            { fromDate, toDate, sourceType }
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
}
