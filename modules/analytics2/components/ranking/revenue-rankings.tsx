'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    useGetRevenueTopArtist,
    useGetRevenueTopDsp,
    useGetRevenueTopTrack,
} from '../../hooks/use-get-revenue-data';
import { RevenueArtistItem, RevenueTrackItem } from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;
    const [artistDetailModal, setArtistDetailModal] = useState<{
        open: boolean;
        title: string;
        artistId: string;
    }>({
        open: false,
        title: '',
        artistId: '',
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

    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
        });

    const { topArtistData, isFetching: isArtistsLoading } =
        useGetRevenueTopArtist({
            fromDate,
            toDate,
            topN,
            includeOther: true,
        });

    const { topTrackData, isFetching: isTracksLoading } = useGetRevenueTopTrack(
        {
            fromDate,
            toDate,
            topN,
            includeOther: true,
        }
    );

    const { topDspData, isFetching: isDspLoading } = useGetRevenueTopDsp({
        fromDate,
        toDate,
        topN,
        includeOther: true,
    });

    const dspDataWithRank = useMemo(() => {
        return topDspData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [topDspData]);

    const artistColumns = useMemo(
        () => [
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
                render: (text: string, record: RevenueArtistItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                src={record.picture}
                            />
                        </div>
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
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
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 125,
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        $
                        {val
                            ? val.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })
                            : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const trackColumns = useMemo(
        () => [
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
                render: (text: string, record: RevenueTrackItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                data={{ id: record.releaseId } as any}
                            />
                        </div>
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
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 100,
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        $
                        {val
                            ? val.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })
                            : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const dspColumns = useMemo(
        () => [
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
                title: messages('common.platforms'),
                dataIndex: 'dspName',
                key: 'dspName',
                width: 150,
                ellipsis: true,
                fixed: 'left' as const,
                render: (text: string) => (
                    <span className="font-medium text-gray-900 dark:text-zinc-100">
                        {text}
                    </span>
                ),
            },
            {
                title: messages('common.quantity'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: 100,
                render: (qty: number) => (
                    <span className="text-gray-600 dark:text-zinc-400">
                        {qty ? qty.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 120,
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        $
                        {val
                            ? val.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })
                            : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('artist.artists'))}
                        columns={artistColumns}
                        dataSource={topArtistData}
                        loading={isArtistsLoading}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.tracks'))}
                        columns={trackColumns}
                        dataSource={topTrackData}
                        loading={isTracksLoading}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.BAR}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.platforms'))}
                        columns={dspColumns}
                        dataSource={dspDataWithRank}
                        loading={isDspLoading}
                        rowKey="dspName"
                        labelKey="dspName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                    />
                </Col>
            </Row>
            <DetailArtistAnalyticsModal
                open={artistDetailModal.open}
                onClose={() =>
                    setArtistDetailModal((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                title={artistDetailModal.title}
                artistId={artistDetailModal.artistId}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailTrackAnalyticsModal
                open={trackDetailModal.open}
                onClose={() =>
                    setTrackDetailModal((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                title={trackDetailModal.title}
                isrc={trackDetailModal.isrc}
                fromDate={fromDate}
                toDate={toDate}
            />
        </>
    );
}
