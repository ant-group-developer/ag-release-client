'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';

import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { BySourceItem, RevenueArtistItem } from '@/modules/analytics2/types';
import { Avatar, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

const COLUMN_WIDTH_RANK = 80;
const COLUMN_WIDTH_ARTIST = 250;
const COLUMN_WIDTH_PROFILES = 180;
const COLUMN_WIDTH_COUNTRY = 150;
const COLUMN_WIDTH_GENRE = 150;
const COLUMN_WIDTH_SOURCE = 280;
const COLUMN_WIDTH_TRACKS = 150;
const COLUMN_WIDTH_USAGE = 150;
const COLUMN_WIDTH_REVENUE = 180;
const MAX_DSP_AVATARS_COUNT = 5;
const DSP_AVATAR_SIZE = 28;

interface ArtistRevenueTableProps {
    dataSource: RevenueArtistItem[];
    loading: boolean;
    dspData?: any;
    onDetailArtist: (artistId: string, artistName: string) => void;
    onDetailSource?: (sourceType: string, title: string) => void;
}

export default function ArtistRevenueTable({
    dataSource,
    loading,
    dspData,
    onDetailArtist,
    onDetailSource,
}: ArtistRevenueTableProps) {
    const messages = useTranslations();

    const revenueColumns: ColumnsType<RevenueArtistItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: COLUMN_WIDTH_RANK,
            align: 'center' as const,
            fixed: 'left',
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
            width: COLUMN_WIDTH_ARTIST,
            ellipsis: true,
            fixed: 'left',
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
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: COLUMN_WIDTH_SOURCE,
            render: (bySource?: BySourceItem[]) => {
                if (!bySource || bySource.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        onDetailSource?.(item.source, item.sourceLabel)
                                    }
                                >
                                    {item.sourceLabel}: ${formattedNumber(item.revenueUsd)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
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
            fixed: 'right',
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
            fixed: 'right',
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
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
            scroll={{ x: SCREEN.LG }}
        />
    );
}
