import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { DeleteVariables } from '@/types/api';
import { theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { TYPE_MODAL_ENRICH_SCAN_SCHEDULE } from '../../enums';
import { useDeleteEnrichScanSchedule } from '../../hooks/use-delete';
import { useGetListEnrichScanSchedule } from '../../hooks/use-get-list';
import { EnrichScanScheduleData } from '../../types';
import EnrichScanScheduleForm from './form';
import EnrichScanScheduleTable from './table';

export default function EnrichDataCronTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<EnrichScanScheduleData>(
        (state) => state.dataEdit
    );
    const { deleteEnrichScanSchedule } = useDeleteEnrichScanSchedule();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const { enrichScanSchedulesData, isFetching } =
        useGetListEnrichScanSchedule();

    const paginatedData = useMemo(() => {
        const totalItems = enrichScanSchedulesData.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const items = enrichScanSchedulesData.slice(startIndex, endIndex);

        return {
            items,
            totalItems,
        };
    }, [enrichScanSchedulesData, page, pageSize]);

    const onChangePage = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    const handleDelete = () => {
        const variables: DeleteVariables<EnrichScanScheduleData['id']> = {
            id: dataEdit?.id,
            onSuccess: closeModal,
        };

        deleteEnrichScanSchedule(variables);
    };

    return (
        <div>
            <EnrichScanScheduleTable
                title={() => (
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Typography.Text strong className="text-sm">
                            {messages(
                                'reportConfigs.enrichScanSchedules.title'
                            )}
                        </Typography.Text>
                        <div className="flex items-center justify-end">
                            <CreateButton
                                canCreate
                                onClick={() =>
                                    openModal(
                                        TYPE_MODAL_ENRICH_SCAN_SCHEDULE.CREATE
                                    )
                                }
                            />
                        </div>
                    </div>
                )}
                sticky
                dataFilter={{
                    page,
                    pageSize,
                }}
                dataSource={paginatedData.items}
                loading={isFetching}
                pagination={{
                    pageSize,
                    current: page,
                }}
                onChange={() => undefined}
            />
            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                    marginTop: 16,
                }}
                align="end"
                current={page}
                pageSize={pageSize}
                total={paginatedData.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_ENRICH_SCAN_SCHEDULE.CREATE ||
                typeModal === TYPE_MODAL_ENRICH_SCAN_SCHEDULE.UPDATE) && (
                <EnrichScanScheduleForm />
            )}

            {typeModal === TYPE_MODAL_ENRICH_SCAN_SCHEDULE.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={handleDelete}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}
        </div>
    );
}
