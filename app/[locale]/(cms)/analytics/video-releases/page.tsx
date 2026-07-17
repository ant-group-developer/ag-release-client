'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailChannelAnalyticsModal from '@/modules/analytics2/components/detail-channel/detail-channel-analytics-modal';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '@/modules/analytics2/components/detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { getAnalyticsViewType } from '@/modules/analytics2/helpers';
import { useGetReleaseVideoRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopReleaseVideo } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ReleaseRankingItem,
    RevenueReleaseVideoItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, Tag, theme, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
}

export default function VideoReleasesRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(
        ANALYTICS_VIEW_TYPE.VIEW
    );

    useEffect(() => {
        setCurrentType(getAnalyticsViewType(searchParams.get('type')));
    }, [searchParams]);

    const [activeDetail, setActiveDetail] = useState<{
        type: 'release' | 'source' | 'label' | 'tenant' | 'channel' | null;
        title: string;
        targetId: string;
    }>({
        type: null,
        title: '',
        targetId: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { releaseVideoRankingData, isFetching: isViewsFetching } =
        useGetReleaseVideoRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: ANALYTICS_RELEASE_TYPE.VIDEO,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topReleaseVideoData, isFetching: isRevenueFetching } =
        useGetRevenueTopReleaseVideo(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
                groupBySource: true,
                releaseType: ANALYTICS_RELEASE_TYPE.VIDEO,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueReleaseVideoItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 120,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.releasesVideo'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text: string, record: RevenueReleaseVideoItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
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
                                    setActiveDetail({
                                        type: 'release',
                                        title: text,
                                        targetId: record.releaseId,
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
            key: 'isrc',
            width: 140,
            ellipsis: true,
            render: (_, record: RevenueReleaseVideoItem) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {record.video?.isrc || record.upc || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 140,
            ellipsis: true,
            render: (text: string, record: RevenueReleaseVideoItem) => {
                const labelId = record.labelId || (record?.release as any)?.labelId;
                const labelName = text || record?.video?.label || '—';
                if (!labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {labelName}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() =>
                                setActiveDetail({
                                    type: 'label',
                                    title: labelName,
                                    targetId: labelId,
                                })
                            }
                        >
                            {labelName}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.workspace'),
            dataIndex: 'workspaces',
            key: 'workspaces',
            width: 180,
            ellipsis: true,
            render: (workspaces: any[]) => {
                if (!workspaces || workspaces.length === 0) return '—';
                return (
                    <div className="flex flex-col gap-2">
                        {workspaces.map((w) => (
                            <div key={w.id} className="flex items-center gap-2">
                                <ReleaseCoverImage
                                    width={32}
                                    height={32}
                                    src={w.logo}
                                />
                                <CustomTooltip
                                    title={messages('common.detailedAnalysis')}
                                >
                                    <Typography.Text
                                        className="cursor-pointer transition-colors hover:text-blue-500"
                                        onClick={() =>
                                            setActiveDetail({
                                                type: 'tenant',
                                                title: w.name,
                                                targetId: w.id,
                                            })
                                        }
                                    >
                                        {w.name}
                                    </Typography.Text>
                                </CustomTooltip>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channels',
            key: 'channels',
            width: 180,
            ellipsis: true,
            render: (channels: any[]) => {
                if (!channels || channels.length === 0) return '—';
                return (
                    <div className="flex flex-col gap-1 items-start">
                        {channels.map((c) => {
                            const youtubeChannelId = c.youtubeChannelId;
                            if (!youtubeChannelId) {
                                return (
                                    <Typography.Text
                                        key={c.id}
                                        className="truncate"
                                    >
                                        {c.name || '—'}
                                    </Typography.Text>
                                );
                            }
                            return (
                                <CustomTooltip
                                    key={c.id}
                                    title={messages('common.viewOnYoutube')}
                                >
                                    <a
                                        href={`https://www.youtube.com/channel/${youtubeChannelId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block max-w-full truncate text-blue-500 hover:underline"
                                    >
                                        {c.name}
                                    </a>
                                </CustomTooltip>
                            );
                        })}
                    </div>
                );
            },
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
            width: 120,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<ReleaseRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 120,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.releasesVideo'),
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
            render: (text: string, record: ReleaseRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        fileId={
                            record.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 max-w-[300px] flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'release',
                                        title: text,
                                        targetId: record.releaseId,
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
            key: 'isrc',
            width: 140,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {record.video?.isrc || record.upc || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 140,
            ellipsis: true,
            render: (text: string, record: ReleaseRankingItem) => {
                const labelId = record.labelId || record?.release?.labelId;
                const labelName = text || record?.video?.label || '—';
                if (!labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {labelName}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() =>
                                setActiveDetail({
                                    type: 'label',
                                    title: labelName,
                                    targetId: labelId,
                                })
                            }
                        >
                            {labelName}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.workspace'),
            dataIndex: 'workspaces',
            key: 'workspaces',
            width: 180,
            ellipsis: true,
            render: (workspaces: any[]) => {
                if (!workspaces || workspaces.length === 0) return '—';
                return (
                    <div className="flex flex-col gap-2">
                        {workspaces.map((w) => (
                            <div key={w.id} className="flex items-center gap-2">
                                <ReleaseCoverImage
                                    width={32}
                                    height={32}
                                    src={w.logo}
                                />
                                <CustomTooltip
                                    title={messages('common.detailedAnalysis')}
                                >
                                    <Typography.Text
                                        className="cursor-pointer transition-colors hover:text-blue-500"
                                        onClick={() =>
                                            setActiveDetail({
                                                type: 'tenant',
                                                title: w.name,
                                                targetId: w.id,
                                            })
                                        }
                                    >
                                        {w.name}
                                    </Typography.Text>
                                </CustomTooltip>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channels',
            key: 'channels',
            width: 180,
            ellipsis: true,
            render: (channels: any[]) => {
                if (!channels || channels.length === 0) return '—';
                return (
                    <div className="flex flex-col gap-1 items-start">
                        {channels.map((c) => {
                            const youtubeChannelId = c.youtubeChannelId;
                            if (!youtubeChannelId) {
                                return (
                                    <Typography.Text
                                        key={c.id}
                                        className="truncate"
                                    >
                                        {c.name || '—'}
                                    </Typography.Text>
                                );
                            }
                            return (
                                <CustomTooltip
                                    key={c.id}
                                    title={messages('common.viewOnYoutube')}
                                >
                                    <a
                                        href={`https://www.youtube.com/channel/${youtubeChannelId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block max-w-full truncate text-blue-500 hover:underline"
                                    >
                                        {c.name}
                                    </a>
                                </CustomTooltip>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: messages('common.youtubeId'),
            key: 'youtubeId',
            width: 140,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => {
                const value = record?.video?.externalId;
                if (!value) return '—';
                return (
                    <div className="flex items-center gap-1 w-fit">
                        <CustomTooltip title={messages('common.viewOnYoutube')}>
                            <a
                                href={`https://www.youtube.com/watch?v=${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block max-w-full truncate text-blue-500 hover:underline"
                            >
                                {value}
                            </a>
                        </CustomTooltip>
                        <span
                            className="inline-block align-middle"
                            data-stop-row-click="true"
                        >
                            <Typography.Text
                                copyable={{
                                    text: value,
                                }}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 150,
            render: (bySource?: any[]) => {
                if (!bySource || bySource.length === 0) return '—';
                return (
                    <PopoverTagsV2
                        items={bySource}
                        maxVisibleTags={1}
                        getKey={(item) => item.source}
                        renderItem={(item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        setActiveDetail({
                                            type: 'source',
                                            title: item.sourceLabel,
                                            targetId: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        )}
                    />
                );
            },
        },

        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 120,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.releasesVideo')} - ${messages('common.revenue')}`
        : `${messages('common.releasesVideo')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS,
        },
        {
            title: pageTitle,
        },
    ];

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <PageContainer
                title={pageTitle}
                header={{
                    breadcrumb: {
                        items: breadcrumbs,
                    },
                }}
                extra={
                    <DateSelect2
                        style={{ width: 240 }}
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        onChange={(value) => {
                            const [start, end] = value.toString().split(',');
                            onChangeFilter({
                                startDate: start,
                                endDate: end,
                            });
                        }}
                    />
                }
            >
                <Card className="rounded-xl border-none shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
                        />
                        <Segmented
                            value={currentType}
                            onChange={(value) => {
                                setCurrentType(value as ANALYTICS_VIEW_TYPE);
                                onChangeFilter({
                                    type: value as ANALYTICS_VIEW_TYPE,
                                });
                            }}
                            options={[
                                {
                                    label: messages('common.views'),
                                    value: ANALYTICS_VIEW_TYPE.VIEW,
                                },
                                {
                                    label: messages('common.revenue'),
                                    value: ANALYTICS_VIEW_TYPE.REVENUE,
                                },
                            ]}
                        />
                    </div>
                    {isRevenue ? (
                        <Table<RevenueReleaseVideoItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topReleaseVideoData.items}
                            loading={isFetching}
                            rowKey="releaseId"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    ) : (
                        <Table<ReleaseRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={releaseVideoRankingData.items}
                            loading={isFetching}
                            rowKey="releaseId"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    )}
                    <AppPagination
                        align="end"
                        className="!mt-4"
                        current={page}
                        pageSize={pageSize}
                        total={
                            isRevenue
                                ? topReleaseVideoData?.metadata?.totalItems || 0
                                : releaseVideoRankingData?.metadata
                                      ?.totalItems || 0
                        }
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
                </Card>

                {activeDetail.type === 'release' && (
                    <DetailReleaseAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({ ...prev, type: null }))
                        }
                        title={activeDetail.title}
                        releaseId={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                )}

                {activeDetail.type === 'source' && (
                    <DetailSourceTypeAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({
                                ...prev,
                                type: null,
                            }))
                        }
                        title={activeDetail.title}
                        sourceType={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                )}

                {activeDetail.type === 'label' && (
                    <DetailLabelAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({
                                ...prev,
                                type: null,
                            }))
                        }
                        title={activeDetail.title}
                        labelId={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                )}

                {activeDetail.type === 'tenant' && (
                    <DetailTenantAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({
                                ...prev,
                                type: null,
                            }))
                        }
                        title={activeDetail.title}
                        tenantId={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                )}

                {activeDetail.type === 'channel' && (
                    <DetailChannelAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({
                                ...prev,
                                type: null,
                            }))
                        }
                        title={activeDetail.title}
                        channelId={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                )}
            </PageContainer>
        </div>
    );
}
