import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    ArtistRankingItem,
    DspRankingItem,
    LabelRankingItem,
    ReleaseRankingItem,
    TenantRankingItem,
    TrackRankingItem,
} from '../../types';


interface DetailModalState {
    type: 'release' | 'track' | 'label' | 'artist' | null;
    title: string;
    id: string;
}

interface Props {
    setDetailModal: React.Dispatch<React.SetStateAction<DetailModalState>>;
}

export function useAnalyticsRankingColumns({ setDetailModal }: Props) {
    const messages = useTranslations();

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
                                        setDetailModal({
                                            type: 'track',
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
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 70,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
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
                                            type: 'release',
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
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 70,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
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
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: 'artist',
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
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 125,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
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
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: 'label',
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
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 90,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
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
                title: messages('tenant.name'),
                dataIndex: 'tenantName',
                key: 'tenantName',
                width: 200,
                ellipsis: true,
                fixed: 'left' as const,
                render: (text: string, record: TenantRankingItem) => (
                    <div className="flex items-center gap-3">
                        <ReleaseCoverImage
                            width={32}
                            height={32}
                            src={record.logo}
                        />
                        <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                            {text || '-'}
                        </span>
                    </div>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 90,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
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
                title: messages('common.dsps'),
                dataIndex: 'dspName',
                key: 'dspName',
                width: 200,
                ellipsis: true,
                fixed: 'left' as const,
                render: (text: string) => (
                    <span className="truncate font-medium text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 90,
                render: (views: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages]
    );

    return {
        trackColumns,
        releaseColumns,
        artistColumns,
        labelColumns,
        tenantColumns,
        dspColumns,
    };
}
