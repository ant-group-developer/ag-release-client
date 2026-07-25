'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_DEFAULT_END_DATE,
} from '@/modules/analytics2/constants/types';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { useGetDspRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopDsp } from '@/modules/analytics2/hooks/use-get-revenue-data';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import {
    BySourceItem,
    DspRankingItem,
    RevenueDspItem,
} from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, Tag, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    groupBySource?: boolean;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function DspsRankingPage() {
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

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

    const requestReleaseType =
        releaseType === ANALYTICS_RELEASE_TYPE.ALL ? undefined : releaseType;

    // Fetch ranking data (Views)
    const { dspRankingData, isFetching: isViewsFetching } = useGetDspRanking(
        {
            fromDate: dataFilter.startDate!,
            toDate: dataFilter.endDate!,
            page,
            pageSize,
            keyword: dataFilter.keyword ?? undefined,
            groupBySource: true,
            releaseType: requestReleaseType,
        },
        { enabled: !isRevenue }
    );

    // Fetch revenue ranking data
    const { topDspData, isFetching: isRevenueFetching } = useGetRevenueTopDsp(
        {
            fromDate: dataFilter.startDate!,
            toDate: dataFilter.endDate!,
            page,
            pageSize,
            keyword: dataFilter.keyword ?? undefined,
            includeOther: false,
            groupBySource: true,
            releaseType: requestReleaseType,
        },
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueDataWithRank = useMemo(() => {
        if (!topDspData?.items) return [];
        return topDspData.items.map((item: RevenueDspItem, index: number) => ({
            ...item,
            rank: (page - 1) * pageSize + index + 1,
        }));
    }, [topDspData, page, pageSize]);

    const viewsDataWithRank = useMemo(() => {
        if (!dspRankingData?.items) return [];
        return dspRankingData.items.map(
            (item: DspRankingItem, index: number) => ({
                ...item,
                rank: (page - 1) * pageSize + index + 1,
            })
        );
    }, [dspRankingData, page, pageSize]);

    const revenueColumns: ColumnsType<RevenueDspItem & { rank: number }> = [
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
            title: messages('common.dsps'),
            dataIndex: 'dspName',
            key: 'dspName',
            width: 250,
            ellipsis: true,
            fixed: 'left',
            render: (text: string) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
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
                                        setDetailSourceModal({
                                            open: true,
                                            title: item.sourceLabel,
                                            sourceType: item.source,
                                        })
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
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
            width: 180,
            fixed: 'right',
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<DspRankingItem & { rank: number }> = [
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
            title: messages('common.dsps'),
            dataIndex: 'dspName',
            key: 'dspName',
            width: 250,
            ellipsis: true,
            fixed: 'left',
            render: (text: string) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
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
                                        setDetailSourceModal({
                                            open: true,
                                            title: item.sourceLabel,
                                            sourceType: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}: {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            fixed: 'right',
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.dsps')} - ${messages('common.revenue')}`
        : `${messages('common.dsps')} - ${messages('common.views')}`;

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
                        <Table
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={revenueDataWithRank}
                            loading={isFetching}
                            rowKey="dspName"
                            pagination={false}
                            scroll={{ x: SCREEN.LG }}
                        />
                    ) : (
                        <Table
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={viewsDataWithRank}
                            loading={isFetching}
                            rowKey="dspName"
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
                                ? topDspData?.metadata?.totalItems || 0
                                : dspRankingData?.metadata?.totalItems || 0
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
                        releaseType={requestReleaseType}
                    />
                )}
            </PageContainer>
        </div>
    );
}
