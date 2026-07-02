'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';

import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { RevenueArtistItem } from '@/modules/analytics2/types';
import { Avatar, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

const COLUMN_WIDTH_RANK = 120;
const COLUMN_WIDTH_PROFILES = 180;
const COLUMN_WIDTH_COUNTRY = 150;
const COLUMN_WIDTH_GENRE = 150;
const COLUMN_WIDTH_TRACKS = 150;
const COLUMN_WIDTH_USAGE = 150;
const COLUMN_WIDTH_REVENUE = 180;
const MAX_DSP_AVATARS_COUNT = 5;

interface ArtistRevenueTableProps {
    dataSource: RevenueArtistItem[];
    loading: boolean;
    dspData?: any;
    onDetailArtist: (artistId: string, artistName: string) => void;
}

export default function ArtistRevenueTable({
    dataSource,
    loading,
    dspData,
    onDetailArtist,
}: ArtistRevenueTableProps) {
    const messages = useTranslations();

    const revenueColumns: ColumnsType<RevenueArtistItem> = [
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
            render: (text: string, record: RevenueArtistItem) => (
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: COLUMN_WIDTH_USAGE,
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
            width: COLUMN_WIDTH_REVENUE,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
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
    ];

    return (
        <Table<RevenueArtistItem>
            sticky
            size="small"
            columns={revenueColumns}
            dataSource={dataSource}
            loading={loading}
            rowKey="artistId"
            pagination={false}
        />
    );
}
