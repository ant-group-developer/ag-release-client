'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ReleaseExecutionDetailModal from '@/modules/release-executions/components/detail-modal';
import ReleaseExecutionHeader from '@/modules/release-executions/components/header';
import ReleaseExecutionStatusSummary from '@/modules/release-executions/components/status-summary';
import ReleaseExecutionTable from '@/modules/release-executions/components/table';
import ReleaseExecutionTableAlert from '@/modules/release-executions/components/table-alert';
import {
    RELEASE_EXECUTION_STATUS,
    TYPE_MODAL_RELEASE_EXECUTION,
} from '@/modules/release-executions/enums';
import { useGetListReleaseExecutions } from '@/modules/release-executions/hooks/use-get-list';
import { ReleaseExecutionFilter } from '@/modules/release-executions/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

export default function ReleaseExecutionsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReleaseExecutionFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const { releaseExecutionsData, isFetching, refetch } =
        useGetListReleaseExecutions(dataFilter);

    const statusSummary = Object.values(RELEASE_EXECUTION_STATUS).map(
        (status) => ({
            status,
            count: releaseExecutionsData?.metadata?.statusCounts?.[status] ?? 0,
        })
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys);
        },
        columnWidth: 40,
        getCheckboxProps: (record: any) => ({
            disabled:
                record.status !== RELEASE_EXECUTION_STATUS.AWAITING_ACTION,
        }),
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('distributionMonitor.label')}>
                <ReleaseExecutionStatusSummary
                    items={statusSummary}
                    loading={isFetching}
                />

                <ReleaseExecutionTable
                    headerTitle={
                        <ReleaseExecutionHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    sticky
                    dataSource={releaseExecutionsData?.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseExecutionsData?.metadata?.page ?? 1,
                    }}
                    rowSelection={rowSelection}
                    tableAlertRender={() => (
                        <ReleaseExecutionTableAlert
                            selectedRowKeys={selectedRowKeys}
                            onSelectedRowKeysChange={setSelectedRowKeys}
                        />
                    )}
                    options={{
                        reload: () => refetch(),
                        setting: false,
                        density: false,
                    }}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={releaseExecutionsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={releaseExecutionsData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_RELEASE_EXECUTION.DETAIL && (
                    <ReleaseExecutionDetailModal open />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
