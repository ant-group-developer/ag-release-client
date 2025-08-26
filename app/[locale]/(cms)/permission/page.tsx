'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import PermissionHeader from '@/modules/permission/components/header';
import PermissionActions from '@/modules/permission/components/header/permission-actions';
import PermissionFormModal from '@/modules/permission/components/modal/permission-form';
import { PermissionTable } from '@/modules/permission/components/table';
import { TYPE_MODAL_PERMISSION } from '@/modules/permission/enums';
import { useBulkDeletePermission } from '@/modules/permission/hooks/use-bulk-delete-permission';
import { useDeletePermission } from '@/modules/permission/hooks/use-delete-permission';
import { useGetListPermission } from '@/modules/permission/hooks/use-get-list-permission';
import {
    PermissionData,
    PermissionDataDataFilter,
} from '@/modules/permission/types';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

type Props = {};

export default function Permission({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PermissionData>((state) => state.dataEdit);
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
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<PermissionDataDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { permissionData, isFetching } = useGetListPermission(dataFilter);
    const { deletePermission } = useDeletePermission();
    const { bulkDeletePermission } = useBulkDeletePermission();

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
        <AppContainer title={messages('permission.label')}>
            <div className="app-header">
                <PermissionHeader dataFilter={dataFilter} onSearch={onSearch} />
                <PermissionActions
                    selectedRowKeys={selectedRow}
                    resetSelectedRows={() => handleResetSelectedRow()}
                />
            </div>
            <PermissionTable
                sticky
                dataSource={permissionData.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: permissionData.metadata.currentPage,
                    total: permissionData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
                rowSelection={rowSelection}
            />

            <AppPagination
                align="end"
                current={permissionData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={permissionData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_PERMISSION.CREATE ||
                typeModal === TYPE_MODAL_PERMISSION.UPDATE) && (
                <PermissionFormModal />
            )}

            {typeModal === TYPE_MODAL_PERMISSION.DELETE && (
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
                        deletePermission({
                            id: dataEdit?.id,
                            onSuccess: () => closeModal(),
                        })
                    }
                />
            )}

            {typeModal === TYPE_MODAL_PERMISSION.BULK_DELETE && (
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
                        bulkDeletePermission({
                            ids: selectedRow,
                            onSuccess: () => {
                                closeModal();
                                handleResetSelectedRow();
                            },
                        })
                    }
                />
            )}
        </AppContainer>
    );
}
