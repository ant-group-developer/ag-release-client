'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import ReleaseLogTable from '@/modules/release-log/components/table';
import ReleaseLogTableFilter from '@/modules/release-log/components/table/release-log-table-filter';
import { useGetListReleaseLog } from '@/modules/release-log/hooks/use-get-list';
import { ReleaseLogFilter } from '@/modules/release-log/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ReleaseLog({}: Props) {
    const {
        dataFilter,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleaseLogFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: 'log.createdAt',
    });
    const messages = useTranslations();

    const { token } = theme.useToken();

    // apis
    const {
        releaseLogData,
        isFetching: isReleaseDataLoading,
        refetch,
    } = useGetListReleaseLog(dataFilter);

    // func
    const handleRefresh = () => {
        refetch();
    };

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
            <PageContainer title={messages('releaseLog.label')}>
                <ReleaseLogTable
                    headerTitle={
                        <ReleaseLogTableFilter
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                        />
                    }
                    sticky
                    dataSource={releaseLogData?.items}
                    loading={isReleaseDataLoading}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseLogData?.metadata?.page ?? 1,
                    }}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={releaseLogData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={releaseLogData?.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
