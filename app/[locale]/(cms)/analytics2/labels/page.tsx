'use client';

import AppSearch from '@/components/ui/input/search';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import { useGetLabelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { LabelRankingItem } from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
}

export default function LabelsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
        });

    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        labelId: string;
    }>({
        open: false,
        title: '',
        labelId: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;

    // Fetch ranking data
    const { labelRankingData, isFetching } = useGetLabelRanking({
        fromDate: dataFilter.startDate!,
        toDate: dataFilter.endDate!,
        page,
        pageSize,
        keyword: dataFilter.keyword,
    });

    const columns = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
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
            ellipsis: true,
            render: (text: string, record: LabelRankingItem) => (
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <span
                        className="cursor-pointer font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                        onClick={() =>
                            setDetailModal({
                                open: true,
                                title: text,
                                labelId: record.labelId,
                            })
                        }
                    >
                        {text}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = `${messages('common.labels')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS2,
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
                    <div style={{ marginBottom: 16 }}>
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={labelRankingData?.items}
                        loading={isFetching}
                        rowKey="labelId"
                        pagination={{
                            current: dataFilter.page,
                            pageSize: dataFilter.pageSize,
                            total: labelRankingData?.metadata?.totalItems,
                            pageSizeOptions: PAGE_SIZE_OPTIONS,
                            showSizeChanger: true,
                            showTotal: (totalCount, range) =>
                                `${range[0]}-${range[1]} / ${totalCount}`,
                            onChange: onChangePage,
                        }}
                    />
                </Card>

                <DetailLabelAnalyticsModal
                    open={detailModal.open}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, open: false }))
                    }
                    title={detailModal.title}
                    labelId={detailModal.labelId}
                    fromDate={dataFilter.startDate!}
                    toDate={dataFilter.endDate!}
                />
            </PageContainer>
        </div>
    );
}
