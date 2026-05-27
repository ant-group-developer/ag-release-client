'use client';

import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Card, Select, Table, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import {
    useGetArtistRanking,
    useGetLabelRanking,
    useGetReleaseRanking,
    useGetTrackRanking,
} from '../hooks/use-get-rankings';
import { useAnalyticsTopNStore } from '../store/use-analytics-top-n-store';
import {
    ArtistRankingItem,
    LabelRankingItem,
    ReleaseRankingItem,
    TrackRankingItem,
} from '../types';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function TracksArtistsTable({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const { topN, setTopN } = useAnalyticsTopNStore();

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

    // Columns config
    const trackColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
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
            width: 350,
            fixed: 'left' as const,
            render: (text: string, record: TrackRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage data={{ id: record.releaseId } as any} />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
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
            width: 200,
            render: (text: string) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 200,
            render: (text: string) => (
                <span className="text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'releaseTitle',
            key: 'releaseTitle',
            width: 300,
            render: (text: string) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 150,
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
            width: 80,
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
            width: 350,
            fixed: 'left' as const,
            render: (text: string, record: ReleaseRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage data={{ id: record.releaseId } as any} />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
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
            width: 200,
            render: (text: string) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 200,
            render: (text: string) => (
                <span className="text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 120,
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
            width: 150,
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
            width: 80,
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
            width: 300,
            fixed: 'left' as const,
            render: (text: string, record: ArtistRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage data={{ id: record.picture } as any} />
                    <span className="font-medium text-gray-900 dark:text-zinc-100">
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 120,
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
            width: 150,
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
            width: 80,
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
            width: 300,
            fixed: 'left' as const,
            render: (text: string, record: LabelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage data={{ id: record.labelId } as any} />
                    <span className="font-medium text-gray-900 dark:text-zinc-100">
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: 150,
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
            width: 150,
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
            width: 150,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const tabItems = [
        {
            key: 'tracks',
            label: messages('common.tracks'),
            children: (
                <Table
                    columns={trackColumns}
                    dataSource={trackRankingData}
                    loading={isTracksFetching}
                    rowKey="isrc"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            ),
        },
        {
            key: 'releases',
            label: messages('common.release'),
            children: (
                <Table
                    columns={releaseColumns}
                    dataSource={releaseRankingData}
                    loading={isReleasesFetching}
                    rowKey="releaseId"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            ),
        },
        {
            key: 'artists',
            label: messages('common.partners'),
            children: (
                <Table
                    columns={artistColumns}
                    dataSource={artistRankingData}
                    loading={isArtistsFetching}
                    rowKey="artistId"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            ),
        },
        {
            key: 'labels',
            label: messages('common.label'),
            children: (
                <Table
                    columns={labelColumns}
                    dataSource={labelRankingData}
                    loading={isLabelsFetching}
                    rowKey="labelId"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            ),
        },
    ];

    return (
        <Card
            className="mt-8 rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <Tabs
                defaultActiveKey="tracks"
                items={tabItems}
                className="analytics-tabs"
                tabBarExtraContent={
                    <div className="flex items-center gap-3">
                        <Select
                            value={topN}
                            onChange={(value) => setTopN(value)}
                            style={{ width: 100 }}
                            options={[
                                { value: 5, label: 'Top 5' },
                                { value: 10, label: 'Top 10' },
                            ]}
                        />
                    </div>
                }
            />
        </Card>
    );
}
