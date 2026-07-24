import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
    ArtistRankingItem,
    ChannelRankingItem,
    DspRankingItem,
    LabelRankingItem,
    ReleaseRankingItem,
    ReleaseVideoRankingItem,
    SourceTypeRankingItem,
    TenantRankingItem,
    TrackRankingItem,
} from '../../types';

import { ANALYTICS_MODAL_TYPE } from '../../enums/modal-type';

interface DetailModalState {
    type: ANALYTICS_MODAL_TYPE | null;
    title: string;
    id: string;
    dspReportId?: string;
}

interface Props {
    setDetailModal: React.Dispatch<React.SetStateAction<DetailModalState>>;
}

export function useAnalyticsRankingColumns({ setDetailModal }: Props) {
    const messages = useTranslations();

    const trackColumns = useMemo(
        () => [
            {
                title: messages('common.track'),
                dataIndex: 'title',
                key: 'title',
                width: '70%',
                ellipsis: true,
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
                                    className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                    onClick={() =>
                                        setDetailModal({
                                            type: ANALYTICS_MODAL_TYPE.TRACK,
                                            title: text,
                                            id: record.isrc,
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
            /* {
                title: 'ISRC',
                dataIndex: 'isrc',
                key: 'isrc',
                width: 140,
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-500 dark:text-zinc-400">
                        {text || '—'}
                    </span>
                ),
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const releaseColumns = useMemo(
        () => [
            {
                title: messages('common.release'),
                dataIndex: 'title',
                key: 'title',
                width: '70%',
                ellipsis: true,
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
                                    className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                    onClick={() =>
                                        setDetailModal({
                                            type: ANALYTICS_MODAL_TYPE.RELEASE,
                                            title: text,
                                            id: record.releaseId,
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
            /* {
                title: 'UPC',
                dataIndex: 'upc',
                key: 'upc',
                width: 140,
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
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const releaseVideoColumns = useMemo(
        () => [
            {
                title: messages('common.releasesVideo'),
                dataIndex: 'title',
                key: 'title',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: ReleaseVideoRankingItem) => (
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
                                    className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                    onClick={() =>
                                        setDetailModal({
                                            type: ANALYTICS_MODAL_TYPE.RELEASE,
                                            title: text,
                                            id: record.releaseId,
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
            /* {
                title: 'ISRC',
                key: 'isrc',
                width: 220,
                ellipsis: true,
                render: (_: any, record: ReleaseVideoRankingItem) => (
                    <span className="truncate text-gray-500 dark:text-zinc-400">
                        {record.video?.isrc || record.upc || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.channel'),
                dataIndex: 'channels',
                key: 'channels',
                width: 220,
                ellipsis: true,
                render: (channels: { id: string; name: string }[]) => {
                    if (!channels || channels.length === 0) return '—';
                    return (
                        <div className="flex flex-wrap gap-1.5">
                            {channels.map((c) => (
                                <CustomTooltip
                                    key={c.id}
                                    title={messages('common.detailedAnalysis')}
                                >
                                    <span
                                        className="cursor-pointer transition-colors hover:text-blue-500 dark:text-zinc-100"
                                        onClick={() =>
                                            setDetailModal({
                                                type: ANALYTICS_MODAL_TYPE.CHANNEL,
                                                title: c.name,
                                                id: c.id,
                                            })
                                        }
                                    >
                                        {c.name}
                                    </span>
                                </CustomTooltip>
                            ))}
                        </div>
                    );
                },
            },
            {
                title: messages('common.workspace'),
                dataIndex: 'workspaces',
                key: 'workspaces',
                width: 220,
                ellipsis: true,
                render: (workspaces: any[]) => {
                    if (!workspaces || workspaces.length === 0) return '—';
                    return (
                        <div className="flex flex-col gap-2">
                            {workspaces.map((w) => (
                                <div
                                    key={w.id}
                                    className="flex items-center gap-2"
                                >
                                    <ReleaseCoverImage
                                        width={32}
                                        height={32}
                                        src={w.logo}
                                    />
                                    <CustomTooltip
                                        title={messages(
                                            'common.detailedAnalysis'
                                        )}
                                    >
                                        <span
                                            className="cursor-pointer transition-colors hover:text-blue-500 dark:text-zinc-100"
                                            onClick={() =>
                                                setDetailModal({
                                                    type: ANALYTICS_MODAL_TYPE.TENANT,
                                                    title: w.name,
                                                    id: w.id,
                                                })
                                            }
                                        >
                                            {w.name}
                                        </span>
                                    </CustomTooltip>
                                </div>
                            ))}
                        </div>
                    );
                },
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const artistColumns = useMemo(
        () => [
            {
                title: messages('common.artist'),
                dataIndex: 'artistName',
                key: 'artistName',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: ArtistRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.picture}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.ARTIST,
                                        title: text,
                                        id: record.artistId,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            /* {
                title: messages('common.tracks'),
                dataIndex: 'trackCount',
                key: 'trackCount',
                width: 150,
                render: (count: number) => (
                    <span className="text-gray-600 dark:text-zinc-400">
                        {count || 0}
                    </span>
                ),
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const labelColumns = useMemo(
        () => [
            {
                title: messages('common.label'),
                dataIndex: 'labelName',
                key: 'labelName',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: LabelRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.picture}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.LABEL,
                                        title: text,
                                        id: record.labelId,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            /* {
                title: messages('common.release'),
                dataIndex: 'releaseCount',
                key: 'releaseCount',
                width: 120,
                render: (count: number) => (
                    <span className="text-gray-600 dark:text-zinc-400">
                        {count || 0}
                    </span>
                ),
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const tenantColumns = useMemo(
        () => [
            {
                title: messages('tenant.name'),
                dataIndex: 'tenantName',
                key: 'tenantName',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: TenantRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.logo}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.TENANT,
                                        title: text,
                                        id: record.tenantId,
                                    })
                                }
                            >
                                {text || '-'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const dspColumns = useMemo(
        () => [
            {
                title: 'DSP',
                dataIndex: 'dspName',
                key: 'dspName',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: DspRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.imageUrl}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.DSP,
                                        title: text,
                                        id: record.pgDspId,
                                        dspReportId: record.dspReportId,
                                    })
                                }
                            >
                                {text || '—'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const channelColumns = useMemo(
        () => [
            {
                title: messages('common.channel'),
                dataIndex: 'channelName',
                key: 'channelName',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: ChannelRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.thumbUrl}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.CHANNEL,
                                        title: text,
                                        id: record.channelId,
                                    })
                                }
                            >
                                {text || '-'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            /* {
                title: messages('common.youtubeChannelId'),
                dataIndex: 'youtubeChannelId',
                key: 'youtubeChannelId',
                width: 180,
                ellipsis: true,
                render: (value: string) => {
                    if (!value) return '—';
                    return (
                        <div className="flex items-center gap-1">
                            <Tooltip title={messages('common.viewOnYoutube')}>
                                <Typography.Link
                                    href={`https://www.youtube.com/channel/${value}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate hover:underline"
                                >
                                    {value}
                                </Typography.Link>
                            </Tooltip>
                            <span
                                className="inline-block align-middle"
                                data-stop-row-click="true"
                            >
                                <Typography.Text
                                    copyable={{
                                        text: value,
                                        tooltips: false,
                                    }}
                                />
                            </span>
                        </div>
                    );
                },
            }, */
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    const sourceTypeColumns = useMemo(
        () => [
            {
                title: messages('analytics2.distributors'),
                dataIndex: 'sourceTypeLabel',
                key: 'sourceTypeLabel',
                width: '70%',
                ellipsis: true,
                render: (text: string, record: SourceTypeRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.imageUrl}
                        />
                        <CustomTooltip title={messages('common.detailedAnalysis')}>
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: ANALYTICS_MODAL_TYPE.SOURCE_TYPE,
                                        title: text,
                                        id: record.sourceType,
                                    })
                                }
                            >
                                {text || '—'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: '30%',
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages, setDetailModal]
    );

    return {
        trackColumns,
        releaseColumns,
        releaseVideoColumns,
        artistColumns,
        labelColumns,
        tenantColumns,
        dspColumns,
        channelColumns,
        sourceTypeColumns,
    };
}
