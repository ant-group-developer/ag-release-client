'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import LogHeader from '@/modules/log/components/log-header';
import LogTable from '@/modules/log/components/log-table';
import { LOG_SORT_FIELD } from '@/modules/log/enums';
import { useGetLogs } from '@/modules/log/hooks/useGetLogs';
import { DataFilterLogs } from '@/modules/log/types/data';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

function LogPage({}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const defaultFilter: DataFilterLogs = {
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: LOG_SORT_FIELD.LOG_CREATED_AT,
    };

    const { dataFilter, onChangePage, onChangeFilter, onSearch } =
        useFilter<DataFilterLogs>(defaultFilter);

    const { logsData, isFetching, refetch } = useGetLogs(dataFilter);

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
            <PageContainer
                title={messages('log.logs')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
            >
                <LogTable
                    sticky
                    dataSource={logsData?.items ?? []}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    onChange={onChangeSort}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: logsData?.metadata?.page,
                    }}
                    headerTitle={
                        <LogHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    options={{
                        reload: () => refetch(),
                    }}
                />
                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={logsData?.metadata?.page || dataFilter.page}
                    pageSize={dataFilter.pageSize}
                    total={logsData?.metadata?.totalItems ?? 0}
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

export default LogPage;
