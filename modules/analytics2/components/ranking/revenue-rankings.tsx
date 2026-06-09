'use client';

import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    useGetRevenueTopArtist,
    useGetRevenueTopDsp,
    useGetRevenueTopTrack,
} from '../../hooks/use-get-revenue-data';
import RankingCard, { RankingCardView } from '../card/ranking-card';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;
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
                render: (text: string, record: any) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                data={{ id: record.picture } as any}
                            />
                        </div>
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
                render: (text: string, record: any) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                data={{ id: record.releaseId } as any}
                            />
                        </div>
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
        <Row gutter={[24, 24]}>
            <Col span={12} xs={24} lg={12}>
                <RankingCard
                    title={topRankingTitle(messages('common.partners'))}
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
    );
}
