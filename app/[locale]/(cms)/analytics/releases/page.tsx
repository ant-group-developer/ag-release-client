'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '@/modules/analytics2/components/detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { useGetReleaseRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopRelease } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ReleaseRankingItem,
    RevenueReleaseItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import {
    Avatar,
    Card,
    Segmented,
    Space,
    Table,
    Tag,
    theme,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function ReleasesRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate:
                searchParams.get('fromDate') || ANALYTICS_DEFAULT_START_DATE,
            endDate: searchParams.get('toDate') || ANALYTICS_DEFAULT_END_DATE,
            type: getAnalyticsViewType(searchParams.get('type')),
            releaseType: getAnalyticsReleaseType(
                searchParams.get('releaseType')
            ),
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(searchParams.get('type'))
    );
    const [releaseType, setReleaseType] = useState<ANALYTICS_RELEASE_TYPE>(() =>
        getAnalyticsReleaseType(searchParams.get('releaseType'))
    );

    useEffect(() => {
        setCurrentType(getAnalyticsViewType(searchParams.get('type')));
        setReleaseType(
            getAnalyticsReleaseType(searchParams.get('releaseType'))
        );
    }, [searchParams]);

    const [activeDetail, setActiveDetail] = useState<{
        type: 'release' | 'source' | 'label' | 'tenant' | null;
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

    const requestReleaseType =
        releaseType === ANALYTICS_RELEASE_TYPE.ALL ? undefined : releaseType;

    // Fetch ranking data (Views)
    const { releaseRankingData, isFetching: isViewsFetching } =
        useGetReleaseRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topReleaseData, isFetching: isRevenueFetching } =
        useGetRevenueTopRelease(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueReleaseItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: RevenueReleaseItem) => (
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
                    <div className="flex min-w-0 max-w-[350px] flex-col">
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
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 160,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (text: string, record: RevenueReleaseItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {text || '—'}
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
                                    title: text,
                                    targetId: record.labelId,
                                })
                            }
                        >
                            {text || '—'}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 240,
            ellipsis: true,
            render: (_, record: RevenueReleaseItem) => {
                const workspace = record?.workspaces?.[0];
                const workspaceName = workspace?.name;

                if (!workspaceName) {
                    return (
                        <Typography.Text className="truncate">
                            {workspaceName || '—'}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Space>
                            <Avatar src={workspace?.logo as string} />
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: workspaceName || '',
                                        targetId: workspace?.id,
                                    })
                                }
                            >
                                {workspaceName || '—'}
                            </Typography.Text>
                        </Space>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: RevenueReleaseItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <PopoverTagsV2
                        items={entries}
                        maxVisibleTags={1}
                        getKey={([key]) => key}
                        renderItem={([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={metadata?.albumUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tag className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500">
                                            {labelName}
                                        </Tag>
                                    </a>
                                </CustomTooltip>
                            );
                        }}
                    />
                );
            },
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
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
                                    {item.sourceLabel}: $
                                    {formattedNumber(item.revenueUsd)}
                                </Tag>
                            </CustomTooltip>
                        )}
                    />
                );
            },
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 140,
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
            width: 150,
            fixed: 'right',
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
            width: 80,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: 'left',
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
                    <div className="flex min-w-0 max-w-[350px] flex-col">
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
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 160,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (text: string, record: ReleaseRankingItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {text || '—'}
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
                                    title: text,
                                    targetId: record.labelId,
                                })
                            }
                        >
                            {text || '—'}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 240,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => {
                const workspace = record?.workspaces?.[0];
                const workspaceName = workspace?.name;
                const tenantId = workspace?.id;
                if (!tenantId) return '-';
                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={workspace?.logo} size={32} />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: workspaceName || '',
                                        targetId: tenantId,
                                    })
                                }
                            >
                                {workspaceName || '—'}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: ReleaseRankingItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <PopoverTagsV2
                        items={entries}
                        maxVisibleTags={1}
                        getKey={([key]) => key}
                        renderItem={([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={metadata?.albumUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tag className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500">
                                            {labelName}
                                        </Tag>
                                    </a>
                                </CustomTooltip>
                            );
                        }}
                    />
                );
            },
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 200,
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
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 150,
            fixed: 'right',
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.releases')} - ${messages('common.revenue')}`
        : `${messages('common.releases')} - ${messages('common.views')}`;

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
                        picker="date"
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
                            value={releaseType}
                            onChange={(value) => {
                                const selectedType =
                                    value as ANALYTICS_RELEASE_TYPE;
                                setReleaseType(selectedType);
                                onChangeFilter({
                                    releaseType:
                                        selectedType ===
                                        ANALYTICS_RELEASE_TYPE.ALL
                                            ? undefined
                                            : selectedType,
                                });
                            }}
                            options={[
                                {
                                    label: messages('common.all'),
                                    value: ANALYTICS_RELEASE_TYPE.ALL,
                                },
                                {
                                    label: messages('common.audio'),
                                    value: ANALYTICS_RELEASE_TYPE.AUDIO,
                                },
                                {
                                    label: messages('common.video'),
                                    value: ANALYTICS_RELEASE_TYPE.VIDEO,
                                },
                            ]}
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
                        <Table<RevenueReleaseItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topReleaseData.items}
                            loading={isFetching}
                            rowKey="releaseId"
                            pagination={false}
                            scroll={{ x: SCREEN.LG }}
                        />
                    ) : (
                        <Table<ReleaseRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={releaseRankingData.items}
                            loading={isFetching}
                            rowKey="releaseId"
                            pagination={false}
                            scroll={{ x: SCREEN.LG }}
                        />
                    )}
                    <AppPagination
                        align="end"
                        className="!mt-4"
                        current={page}
                        pageSize={pageSize}
                        total={
                            isRevenue
                                ? topReleaseData?.metadata?.totalItems || 0
                                : releaseRankingData?.metadata?.totalItems || 0
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
                        releaseType={requestReleaseType}
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
                        releaseType={requestReleaseType}
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
                        releaseType={requestReleaseType}
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
                        releaseType={requestReleaseType}
                    />
                )}
            </PageContainer>
        </div>
    );
}
