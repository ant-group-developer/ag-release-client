'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { formattedDate, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';

import RolesHeader from '@/modules/Roles/components/header';
import RolesActions from '@/modules/Roles/components/header/roles-actions';
import RolesFormModal from '@/modules/Roles/components/modal/roles-form';
import { RolesTable } from '@/modules/Roles/components/table';
import { TYPE_MODAL_ROLES } from '@/modules/Roles/enums';
import { useBulkDeleteRoles } from '@/modules/Roles/hooks/use-bulk-delete-roles';
import { useDeleteRole } from '@/modules/Roles/hooks/use-delete-role';
import { useGetListRoles } from '@/modules/Roles/hooks/use-get-list-roles';
import { RolesData, RolesDataDataFilter } from '@/modules/Roles/types';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

type Props = {};

export default function Roles({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<RolesData>((state) => state.dataEdit);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);

    // func
    const handleResetSelectedRow = () => {
        setSelectedRow([]);
    };
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    // const
    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 20,
    };

    // apis
    const {
        dataFilter,
        canClearFilter,
        onChangeFilter,
        onChangePage,
        removeFilter,
    } = useFilter<RolesDataDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const { rolesData, dataUpdatedAt, refetch, isFetching } =
        useGetListRoles(dataFilter);
    const { deleteRole } = useDeleteRole();
    const { bulkDeleteRoles } = useBulkDeleteRoles();

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
        <div>
            <div className="app-header">
                <RolesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={() => refetch()}
                    lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
                />
                <RolesActions
                    selectedRowKeys={selectedRow}
                    resetSelectedRows={() => handleResetSelectedRow()}
                />
            </div>

            <RolesTable
                dataSource={rolesData.items}
                scroll={{
                    y: scrollY,
                }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: rolesData.metadata.currentPage,
                    total: rolesData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
                rowSelection={rowSelection}
            />

            <AppPagination
                className="border-b border-t"
                align="end"
                current={rolesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={rolesData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_ROLES.CREATE ||
                typeModal === TYPE_MODAL_ROLES.UPDATE) && <RolesFormModal />}

            {typeModal === TYPE_MODAL_ROLES.DELETE && (
                <AppConfirm
                    open
                    modalTitle={messages('action.delete.title', {
                        label: dataEdit?.name,
                    })}
                    paragraph={messages('action.delete.alert', {
                        label: dataEdit?.name,
                    })}
                    onCancel={closeModal}
                    onOk={() =>
                        deleteRole({
                            id: dataEdit?.id,
                            onSuccess: () => closeModal(),
                        })
                    }
                />
            )}

            {typeModal === TYPE_MODAL_ROLES.BULK_DELETE && (
                <AppConfirm
                    open
                    modalTitle={messages('action.delete.title', {
                        label: '',
                    })}
                    paragraph={messages('action.delete.alert', {
                        label: '',
                    })}
                    onCancel={closeModal}
                    onOk={() =>
                        bulkDeleteRoles({
                            ids: selectedRow,
                            onSuccess: () => {
                                closeModal();
                                handleResetSelectedRow();
                            },
                        })
                    }
                />
            )}
        </div>
    );
}
