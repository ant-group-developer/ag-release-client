import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    RevenueArtistItem,
    RevenueLabelItem,
    RevenueReleaseItem,
    RevenueTenantItem,
    RevenueTrackItem,
} from '../../types';
import { RANK_COLUMN_WIDTH } from '../../constants/types';

interface DetailModalState {
    type: 'artist' | 'track' | 'release' | 'label' | 'tenant' | null;
    title: string;
    id: string;
}

interface Props {
    setDetailModal: React.Dispatch<React.SetStateAction<DetailModalState>>;
}

export function useRevenueRankingColumns({ setDetailModal }: Props) {
    const messages = useTranslations();

    const artistColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
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
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: 125,
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
        [messages, setDetailModal]
    );

    const trackColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
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
                width: 100,
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-500 dark:text-zinc-400">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: 90,
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
        [messages, setDetailModal]
    );

    const releaseColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
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
                render: (text: string, record: RevenueReleaseItem) => (
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
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: 90,
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
        [messages, setDetailModal]
    );

    const dspColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
                fixed: 'left' as const,
                align: 'center' as const,
                render: (rank: number) => (
                    <span className="font-bold text-gray-700 dark:text-zinc-300">
                        #{rank}
                    </span>
                ),
            },
            {
                title: 'DSP',
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
                title: messages('common.usage'),
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

    const tenantColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
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
                render: (text: string, record: RevenueTenantItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                src={record.logo}
                            />
                        </div>
                        <CustomTooltip title={messages('common.detailedAnalysis')}>
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        type: 'tenant',
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
                title: messages('common.usage'),
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
        [messages, setDetailModal]
    );

    const labelColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: RANK_COLUMN_WIDTH,
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
                width: 180,
                ellipsis: true,
                fixed: 'left' as const,
                render: (text: string, record: RevenueLabelItem) => (
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
                title: messages('common.releases'),
                dataIndex: 'releaseCount',
                key: 'releaseCount',
                width: 100,
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
                width: 100,
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
                width: 120,
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
        [messages, setDetailModal]
    );

    return {
        artistColumns,
        trackColumns,
        releaseColumns,
        dspColumns,
        tenantColumns,
        labelColumns,
    };
}
