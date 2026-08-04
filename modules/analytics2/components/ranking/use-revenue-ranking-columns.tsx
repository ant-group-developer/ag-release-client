import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedNumber } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
    RevenueArtistItem,
    RevenueChannelItem,
    RevenueDspItem,
    RevenueLabelItem,
    RevenueReleaseItem,
    RevenueReleaseVideoItem,
    RevenueSourceTypeItem,
    RevenueTenantItem,
    RevenueTrackItem,
} from '../../types';

import { ANALYTICS_ENTITY_TYPE } from '../../enums';
import { ANALYTICS_MODAL_TYPE } from '../../enums/modal-type';

interface DetailModalState {
    type: ANALYTICS_MODAL_TYPE | null;
    title: string;
    id: string;
    upc?: string;
    dspReportId?: string;
}

interface Props {
    setDetailModal?: React.Dispatch<React.SetStateAction<DetailModalState>>;
    fromDate?: string;
    toDate?: string;
}

export function useRevenueRankingColumns({
    setDetailModal,
    fromDate,
    toDate,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const artistColumns = useMemo(
        () => [
            {
                title: messages('common.artist'),
                dataIndex: 'artistName',
                key: 'artistName',
                width: '60%',
                ellipsis: true,
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
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.ARTIST,
                                                id: record.artistId,
                                            },
                                        }
                                    )
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
                width: 125,
                render: (count: number) => (
                    <span className="text-gray-600 dark:text-zinc-400">
                        {count || 0}
                    </span>
                ),
            }, */
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const trackColumns = useMemo(
        () => [
            {
                title: messages('common.track'),
                dataIndex: 'title',
                key: 'title',
                width: '60%',
                ellipsis: true,
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
                                        openModal(
                                            ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                            {
                                                fromDate,
                                                toDate,
                                                initialEntity: {
                                                    type: ANALYTICS_ENTITY_TYPE.TRACK,
                                                    id: record.isrc,
                                                },
                                            }
                                        )
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
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const releaseColumns = useMemo(
        () => [
            {
                title: messages('common.release'),
                dataIndex: 'title',
                key: 'title',
                width: '60%',
                ellipsis: true,
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
                                        openModal(
                                            ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                            {
                                                fromDate,
                                                toDate,
                                                initialEntity: {
                                                    type: ANALYTICS_ENTITY_TYPE.RELEASE,
                                                    id: record.releaseId,
                                                },
                                            }
                                        )
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
            }, */
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const releaseVideoColumns = useMemo(
        () => [
            {
                title: messages('common.releasesVideo'),
                dataIndex: 'title',
                key: 'title',
                width: '60%',
                ellipsis: true,
                render: (text: string, record: RevenueReleaseVideoItem) => (
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
                                        openModal(
                                            ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                            {
                                                fromDate,
                                                toDate,
                                                initialEntity: {
                                                    type: ANALYTICS_ENTITY_TYPE.RELEASE,
                                                    id: record.releaseId,
                                                },
                                            }
                                        )
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
                render: (_: any, record: RevenueReleaseVideoItem) => (
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
                                        className="cursor-pointer transition-colors dark:text-zinc-100"
                                        onClick={() => {
                                            // setDetailModal({
                                            //     type: ANALYTICS_MODAL_TYPE.CHANNEL,
                                            //     title: c.name,
                                            //     id: c.id,
                                            // })
                                        }}
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
                                            className="cursor-pointer transition-colors dark:text-zinc-100"
                                            onClick={() => {
                                                // setDetailModal({
                                                //     type: ANALYTICS_MODAL_TYPE.TENANT,
                                                //     title: w.name,
                                                //     id: w.id,
                                                // })
                                            }}
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
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );
    const dspColumns = useMemo(
        () => [
            {
                title: 'DSP',
                dataIndex: 'dspName',
                key: 'dspName',
                width: '60%',
                ellipsis: true,
                render: (text: string, record: RevenueDspItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                src={record.imageUrl}
                            />
                        </div>
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.DSP,
                                                id: record.pgDspId ?? '',
                                                entitySubId: record.dspReportId,
                                            },
                                        }
                                    )
                                }
                            >
                                {text || '—'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const tenantColumns = useMemo(
        () => [
            {
                title: messages('tenant.name'),
                dataIndex: 'tenantName',
                key: 'tenantName',
                width: '60%',
                ellipsis: true,
                render: (text: string, record: RevenueTenantItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                src={record.logo}
                            />
                        </div>
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                                id: record.tenantId,
                                            },
                                        }
                                    )
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
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const labelColumns = useMemo(
        () => [
            {
                title: messages('common.label'),
                dataIndex: 'labelName',
                key: 'labelName',
                width: '60%',
                ellipsis: true,
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
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.LABEL,
                                                id: record.labelId,
                                            },
                                        }
                                    )
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            /* {
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
            }, */
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const channelColumns = useMemo(
        () => [
            {
                title: messages('common.channel'),
                dataIndex: 'channelName',
                key: 'channelName',
                width: '60%',
                ellipsis: true,
                render: (text: string, record: RevenueChannelItem) => (
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
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.CHANNEL,
                                                id: record.channelId,
                                            },
                                        }
                                    )
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
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages, openModal, fromDate, toDate]
    );

    const sourceTypeColumns = useMemo(
        () => [
            {
                title: messages('analytics2.distributors'),
                dataIndex: 'sourceTypeLabel',
                key: 'sourceTypeLabel',
                width: '60%',
                ellipsis: true,
                render: (text: string, record: RevenueSourceTypeItem) => (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ReleaseCoverImage
                                width={32}
                                height={32}
                                src={record.imageUrl}
                            />
                        </div>
                        <CustomTooltip title={messages('common.detailedAnalysis')}>
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            initialEntity: {
                                                type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                                id: record.sourceType,
                                            },
                                        }
                                    )
                                }
                            >
                                {text || '—'}
                            </span>
                        </CustomTooltip>
                    </div>
                ),
            },
            {
                title: messages('common.usage'),
                dataIndex: 'quantity',
                key: 'quantity',
                width: '20%',
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
                width: '20%',
                render: (val: number) => (
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
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
        releaseVideoColumns,
        dspColumns,
        tenantColumns,
        labelColumns,
        channelColumns,
        sourceTypeColumns,
    };
}
