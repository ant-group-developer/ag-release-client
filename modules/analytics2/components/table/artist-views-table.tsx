'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';

import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ArtistRankingItem, BySourceItem } from '@/modules/analytics2/types';
import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';

const COLUMN_WIDTH_RANK = 80;
const COLUMN_WIDTH_ARTIST = 250;
const COLUMN_WIDTH_PROFILES = 180;
const COLUMN_WIDTH_COUNTRY = 150;
const COLUMN_WIDTH_GENRE = 150;
const COLUMN_WIDTH_SOURCE = 280;
const COLUMN_WIDTH_TRACKS = 150;
const COLUMN_WIDTH_VIEWS = 180;
const MAX_DSP_AVATARS_COUNT = 5;
const DSP_AVATAR_SIZE = 28;

interface ArtistViewsTableProps {
    dataSource: ArtistRankingItem[];
    loading: boolean;
    dspData?: any;
    toolbar?: any;
    onDetailArtist: (
        artistId: string,
        artistName: string,
        thumbnailUrl?: string | null
    ) => void;
    onDetailSource?: (sourceType: string, title: string) => void;
}

export default function ArtistViewsTable({
    dataSource,
    loading,
    dspData,
    toolbar,
    onDetailArtist,
    onDetailSource,
}: ArtistViewsTableProps) {
    const messages = useTranslations();

    const viewColumns: ProColumns<ArtistRankingItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: COLUMN_WIDTH_RANK,
            align: 'center' as const,
            fixed: 'left',
            render: (_, record: ArtistRankingItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            width: COLUMN_WIDTH_ARTIST,
            ellipsis: true,
            fixed: 'left',
            render: (_, record: ArtistRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={record.artistName}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer truncate transition-colors hover:text-blue-500"
                            onClick={() =>
                                onDetailArtist(
                                    record.artistId,
                                    record.artistName,
                                    record.picture
                                )
                            }
                        >
                            {record.artistName}
                        </Typography.Text>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('artist.profiles'),
            key: 'profiles',
            dataIndex: 'profiles',
            width: COLUMN_WIDTH_PROFILES,
            render: (_, record: ArtistRankingItem) => (
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
            render: (_, record: ArtistRankingItem) => (
                <Typography.Text type="secondary" className="truncate">
                    {record?.country || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('genre.label'),
            key: 'genre',
            dataIndex: 'genre',
            width: COLUMN_WIDTH_GENRE,
            ellipsis: true,
            render: (_, record: ArtistRankingItem) => (
                <Typography.Text type="secondary" className="truncate">
                    {record?.genre || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: COLUMN_WIDTH_SOURCE,
            render: (_, record: ArtistRankingItem) => {
                const bySource = record.bySource;
                if (!bySource || bySource.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item: BySourceItem) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        onDetailSource?.(
                                            item.source,
                                            item.sourceLabel
                                        )
                                    }
                                >
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.quantity)}
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
            render: (_, record: ArtistRankingItem) => (
                <Typography.Text type="secondary">
                    {record.trackCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: COLUMN_WIDTH_VIEWS,
            fixed: 'right',
            render: (_, record: ArtistRankingItem) => (
                <Typography.Text>
                    {record.totalViews ? record.totalViews.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
        <AppProTable<ArtistRankingItem>
            className="[&_.ant-pro-table-list-toolbar-container]:!px-0 [&_.ant-pro-table-list-toolbar-container]:!pt-0"
            toolbar={toolbar}
            sticky
            size="small"
            columns={viewColumns}
            dataSource={dataSource}
            loading={loading}
            rowKey="artistId"
            pagination={false}
            search={false}
            options={false}
            scroll={{ x: SCREEN.LG }}
        />
    );
}
