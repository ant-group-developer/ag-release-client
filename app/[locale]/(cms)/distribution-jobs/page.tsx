'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DistributionJobDetailModal from '@/modules/distribution-jobs/components/detail-modal';
import DistributionJobsGroupedTable from '@/modules/distribution-jobs/components/grouped-table';
import DistributionJobsHeader from '@/modules/distribution-jobs/components/header';
import { useGetListDistributionJobsGrouped } from '@/modules/distribution-jobs/hooks/use-get-list-grouped';
import { DistributionJobFilter } from '@/modules/distribution-jobs/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

export default function DistributionJobsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<DistributionJobFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            orderBy: ORDER.DESC,
            // fieldOrder: 'job.createdAt',
        });

    const { distributionJobsGroupedData, isFetching, refetch } =
        useGetListDistributionJobsGrouped(dataFilter);

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('distributionJobs.label')}>
                <DistributionJobsGroupedTable
                    headerTitle={
                        <DistributionJobsHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    sticky
                    dataSource={distributionJobsGroupedData?.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current:
                            distributionJobsGroupedData?.metadata?.page ?? 1,
                    }}
                    options={{
                        reload: () => refetch(),
                        setting: false,
                        density: false,
                    }}
                    onChange={onChangeSort}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={
                        distributionJobsGroupedData?.metadata?.page ??
                        dataFilter.page ??
                        1
                    }
                    pageSize={dataFilter.pageSize}
                    total={
                        distributionJobsGroupedData?.metadata?.totalItems ??
                        distributionJobsGroupedData?.items?.length ??
                        0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>

            <DistributionJobDetailModal
                groupedData={distributionJobsGroupedData?.items}
            />
        </AppPageWrapper>
    );
}

