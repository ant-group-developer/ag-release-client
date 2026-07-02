'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';

import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ArtistRankingItem } from '@/modules/analytics2/types';
import { Avatar, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

const COLUMN_WIDTH_RANK = 120;
const COLUMN_WIDTH_PROFILES = 180;
const COLUMN_WIDTH_COUNTRY = 150;
const COLUMN_WIDTH_GENRE = 150;
const COLUMN_WIDTH_TRACKS = 150;
const COLUMN_WIDTH_VIEWS = 180;
const MAX_DSP_AVATARS_COUNT = 5;
const DSP_AVATAR_SIZE = 28;

interface ArtistViewsTableProps {
    dataSource: ArtistRankingItem[];
    loading: boolean;
    dspData?: any;
    onDetailArtist: (artistId: string, artistName: string) => void;
}

export default function ArtistViewsTable({
    dataSource,
    loading,
    dspData,
    onDetailArtist,
}: ArtistViewsTableProps) {
    const messages = useTranslations();

    const viewColumns: ColumnsType<ArtistRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: COLUMN_WIDTH_RANK,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            ellipsis: true,
            render: (text: string, record: ArtistRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() => onDetailArtist(record.artistId, text)}
                        >
                            {text}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('artist.profiles'),
            key: 'profiles',
            dataIndex: 'profiles',
            width: COLUMN_WIDTH_PROFILES,
            render: (_, record) => (
                <div>
                    <Avatar.Group
                        max={{
                            count: MAX_DSP_AVATARS_COUNT,
                            style: { backgroundColor: '#ccc' },
                        }}
                    >
                        {record?.profiles?.map((item) => {
                            const dsp = dspData?.items?.find(
                                (d: any) => d.code === item.dspCode
                            );
                            return (
                                <CustomTooltip
                                    key={item.dspCode}
                                    title={item.dspName || item.dspCode}
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Avatar
                                            size={DSP_AVATAR_SIZE}
                                            src={dsp?.picture}
                                            style={{ backgroundColor: '#ccc' }}
                                        >
                                            {(item.dspName || item.dspCode)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                    </a>
                                </CustomTooltip>
                            );
                        })}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: messages('country.label'),
            key: 'country',
            dataIndex: 'country',
            width: COLUMN_WIDTH_COUNTRY,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.country || '-'}
                </span>
            ),
        },
        {
            title: messages('genre.label'),
            key: 'genre',
            dataIndex: 'genre',
            width: COLUMN_WIDTH_GENRE,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.genre || '-'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: COLUMN_WIDTH_TRACKS,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: COLUMN_WIDTH_VIEWS,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    return (
        <Table<ArtistRankingItem>
            sticky
            size="small"
            columns={viewColumns}
            dataSource={dataSource}
            loading={loading}
            rowKey="artistId"
            pagination={false}
        />
    );
}
