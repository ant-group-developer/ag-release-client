'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { formattedNumber } from '@/helpers/common';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import {
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
    RANK_COLUMN_WIDTH,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_DEFAULT_END_DATE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { useGetLabelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopLabel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { LabelRankingItem, RevenueLabelItem } from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, Tag, theme, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

const RELEASES_COLUMN_WIDTH = 140;
const TRACKS_COLUMN_WIDTH = 140;
const TENANT_COLUMN_WIDTH = 180;
const QUANTITY_COLUMN_WIDTH = 140;
const REVENUE_COLUMN_WIDTH = 160;
const VIEWS_COLUMN_WIDTH = 160;
const LABEL_COLUMN_WIDTH = 300;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function LabelsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate:
                searchParams.get('fromDate') || ANALYTICS_DEFAULT_START_DATE,
            endDate:
                searchParams.get('toDate') || ANALYTICS_DEFAULT_END_DATE,
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
        type: 'source' | 'label' | 'tenant' | null;
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
    const { labelRankingData, isFetching: isViewsFetching } =
        useGetLabelRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topLabelData, isFetching: isRevenueFetching } =
        useGetRevenueTopLabel(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
                groupBySource: true,
                releaseType,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueLabelItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: RANK_COLUMN_WIDTH,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            ellipsis: true,
            width: LABEL_COLUMN_WIDTH,
            render: (text: string, record: RevenueLabelItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
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
                </div>
            ),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: TENANT_COLUMN_WIDTH,
            ellipsis: true,
            render: (tenant: any) => {
                const tenantName = tenant?.name;
                if (!tenantName) {
                    return (
                        <Typography.Text className="truncate">
                            {tenantName || '—'}
                        </Typography.Text>
                    );
                }
                return (
                    <div className="flex items-center gap-3">
                        <ImageFallback
                            src={tenant.logo ?? ''}
                            alt={tenantName}
                            width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            className="aspect-square rounded-full object-cover"
                        />
                        <CustomTooltip title={messages('common.detailedAnalysis')}>
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: tenantName,
                                        targetId: tenant.id,
                                    })
                                }
                            >
                                {tenantName}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
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
                        maxVisibleTags={2}
                        getKey={(item) => item.source}
                        renderItem={(item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        setActiveDetail({
                                            type: 'source',
                                            title: item.sourceLabel,
                                            targetId: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}: ${formattedNumber(item.revenueUsd)}
                                </Tag>
                            </CustomTooltip>
                        )}
                    />
                );
            },
        },
        {
            title: messages('common.releases'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: RELEASES_COLUMN_WIDTH,
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
            width: TRACKS_COLUMN_WIDTH,
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
            width: QUANTITY_COLUMN_WIDTH,
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
            width: REVENUE_COLUMN_WIDTH,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<LabelRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: RANK_COLUMN_WIDTH,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            ellipsis: true,
            width: LABEL_COLUMN_WIDTH,
            render: (text: string, record: LabelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
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
                </div>
            ),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: TENANT_COLUMN_WIDTH,
            ellipsis: true,
            render: (tenant: any) => {
                const tenantName = tenant?.name;
                if (!tenantName) {
                    return (
                        <Typography.Text className="truncate">
                            {tenantName || '—'}
                        </Typography.Text>
                    );
                }
                return (
                    <div className="flex items-center gap-3">
                        <ImageFallback
                            src={tenant.logo ?? ''}
                            alt={tenantName}
                            width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            className="aspect-square rounded-full object-cover"
                        />
                        <CustomTooltip title={messages('common.detailedAnalysis')}>
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: tenantName,
                                        targetId: tenant.id,
                                    })
                                }
                            >
                                {tenantName}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
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
                        maxVisibleTags={2}
                        getKey={(item) => item.source}
                        renderItem={(item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        setActiveDetail({
                                            type: 'source',
                                            title: item.sourceLabel,
                                            targetId: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}: {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        )}
                    />
                );
            },
        },
        {
            title: messages('common.releases'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: RELEASES_COLUMN_WIDTH,
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
            width: TRACKS_COLUMN_WIDTH,
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
            width: VIEWS_COLUMN_WIDTH,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.labels')} - ${messages('common.revenue')}`
        : `${messages('common.labels')} - ${messages('common.views')}`;

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
                            value={releaseType}
                            onChange={(value) => {
                                setReleaseType(value as ANALYTICS_RELEASE_TYPE);
                                onChangeFilter({
                                    releaseType:
                                        value as ANALYTICS_RELEASE_TYPE,
                                });
                            }}
                            options={[
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
                        <Table<RevenueLabelItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topLabelData?.items}
                            loading={isFetching}
                            rowKey="labelId"
                            pagination={false}
                        />
                    ) : (
                        <Table<LabelRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={labelRankingData?.items}
                            loading={isFetching}
                            rowKey="labelId"
                            pagination={false}
                        />
                    )}
                    <AppPagination
                        align="end"
                        className="!mt-4"
                        current={page}
                        pageSize={pageSize}
                        total={
                            isRevenue
                                ? topLabelData?.metadata?.totalItems || 0
                                : labelRankingData?.metadata?.totalItems || 0
                        }
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
                </Card>

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
                        releaseType={releaseType}
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
                        releaseType={releaseType}
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
                        releaseType={releaseType}
                    />
                )}
            </PageContainer>
        </div>
    );
}
