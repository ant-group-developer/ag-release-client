'use client';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
    RANK_COLUMN_WIDTH,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { useGetSourceTypeRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopSourceType } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    RevenueSourceTypeItem,
    SourceTypeRankingItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function SourceTypesRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const [detailSourceModal, setDetailSourceModal] = useState<{
        open: boolean;
        title: string;
        sourceType: string;
    }>({
        open: false,
        title: '',
        sourceType: '',
    });

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

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { sourceTypeRankingData, isFetching: isViewsFetching } =
        useGetSourceTypeRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                releaseType,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topSourceTypeData, isFetching: isRevenueFetching } =
        useGetRevenueTopSourceType(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                releaseType,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const viewItems = useMemo(() => {
        return (
            sourceTypeRankingData?.items?.map(
                (item: SourceTypeRankingItem, index: number) => ({
                    ...item,
                    rank: item.rank || (page - 1) * pageSize + index + 1,
                })
            ) || []
        );
    }, [sourceTypeRankingData, page, pageSize]);

    const revenueItems = useMemo(() => {
        return (
            topSourceTypeData?.items?.map(
                (item: RevenueSourceTypeItem, index: number) => ({
                    ...item,
                    rank: item.rank || (page - 1) * pageSize + index + 1,
                })
            ) || []
        );
    }, [topSourceTypeData, page, pageSize]);

    const revenueColumns: ColumnsType<RevenueSourceTypeItem> = [
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
            title: messages('analytics2.distributors'),
            dataIndex: 'sourceTypeLabel',
            key: 'sourceTypeLabel',
            ellipsis: true,
            render: (text: string, record: RevenueSourceTypeItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={32}
                        height={32}
                        src={record.imageUrl}
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setDetailSourceModal({
                                    open: true,
                                    title: text,
                                    sourceType: record.sourceType,
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 250,
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
            width: 250,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<SourceTypeRankingItem> = [
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
            title: messages('analytics2.distributors'),
            dataIndex: 'sourceTypeLabel',
            key: 'sourceTypeLabel',
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
                            className="cursor-pointer text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setDetailSourceModal({
                                    open: true,
                                    title: text,
                                    sourceType: record.sourceType,
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
            width: 180,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('analytics2.distributors')} - ${messages('common.revenue')}`
        : `${messages('analytics2.distributors')} - ${messages('common.views')}`;

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
                        <Table<RevenueSourceTypeItem>
                            sticky
                            columns={revenueColumns}
                            dataSource={revenueItems}
                            loading={isFetching}
                            rowKey="sourceType"
                            size="small"
                            pagination={false}
                        />
                    ) : (
                        <Table<SourceTypeRankingItem>
                            sticky
                            columns={viewColumns}
                            dataSource={viewItems}
                            loading={isFetching}
                            rowKey="sourceType"
                            size="small"
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
                                ? topSourceTypeData?.metadata?.totalItems || 0
                                : sourceTypeRankingData?.metadata?.totalItems ||
                                  0
                        }
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
                </Card>
                {detailSourceModal.open && (
                    <DetailSourceTypeAnalyticsModal
                        open={detailSourceModal.open}
                        onClose={() =>
                            setDetailSourceModal((prev) => ({
                                ...prev,
                                open: false,
                            }))
                        }
                        title={detailSourceModal.title}
                        sourceType={detailSourceModal.sourceType}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={releaseType}
                    />
                )}
            </PageContainer>
        </div>
    );
}
