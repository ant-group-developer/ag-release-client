import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE_EXECUTION } from '@/modules/release-executions/enums';
import ReleaseSubmitDetailModal from '@/modules/release-submit/components/detail-modal';
import ReleaseSubmitHeader from '@/modules/release-submit/components/header';
import ReleaseSubmitSnapshotModal from '@/modules/release-submit/components/snapshot-modal';
import ReleaseSubmitTable from '@/modules/release-submit/components/table';
import { FieldOrderReleaseExecution3 } from '@/modules/release-submit/enums';
import { useGetListReleaseSubmits } from '@/modules/release-submit/hooks/use-get-list';
import { ReleaseSubmitFilter } from '@/modules/release-submit/types';
import { theme } from 'antd';
import { useState } from 'react';

type Props = {
    releaseId?: string;
};

export default function SubmitsTab({ releaseId }: Props) {
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
        defaultFilter,
    } = useFilter<ReleaseSubmitFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: FieldOrderReleaseExecution3.execution_createdAt,
        releaseIds: releaseId ? [releaseId] : [],
        latestOnly: true,
    });

    const { releaseSubmitsData, isFetching, refetch } =
        useGetListReleaseSubmits(dataFilter);

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
        <div className="flex flex-col gap-4">
            <ReleaseSubmitTable
                showIsrc
                headerTitle={
                    <ReleaseSubmitHeader
                        dataFilter={dataFilter}
                        defaultFilter={defaultFilter}
                        onChangeFilter={onChangeFilter}
                        canClearFilter={canClearFilter}
                        removeFilter={removeFilter}
                    />
                }
                sticky
                dataSource={releaseSubmitsData?.items}
                loading={isFetching}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: releaseSubmitsData?.metadata?.page ?? 1,
                }}
                options={{
                    reload: () => refetch(),
                    setting: false,
                    density: false,
                }}
                onChange={onChangeSort}
                onViewSnapshot={(record) => {
                    setSelectedRecord(record);
                    setSnapshotModalOpen(true);
                }}
            />

            <AppPagination
                className="rounded-b-md"
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={
                    releaseSubmitsData?.metadata?.page ?? dataFilter.page ?? 1
                }
                pageSize={dataFilter.pageSize}
                total={
                    releaseSubmitsData?.metadata?.totalItems ??
                    releaseSubmitsData?.items?.length ??
                    0
                }
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_RELEASE_EXECUTION.DETAIL && (
                <ReleaseSubmitDetailModal open />
            )}

            <ReleaseSubmitSnapshotModal
                open={snapshotModalOpen}
                onCancel={() => {
                    setSnapshotModalOpen(false);
                    setSelectedRecord(null);
                }}
                record={selectedRecord}
            />
        </div>
    );
}
