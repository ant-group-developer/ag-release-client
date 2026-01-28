'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import PermissionCreateModal from '@/modules/permission/components/modal/permission-create-modal';
import PermissionUpdateModal from '@/modules/permission/components/modal/permission-update-modal';
import { PermissionTable } from '@/modules/permission/components/table';
import { TYPE_MODAL_PERMISSION } from '@/modules/permission/enums';
import { useBulkDeletePermission } from '@/modules/permission/hooks/use-bulk-delete-permission';
import { useDeletePermission } from '@/modules/permission/hooks/use-delete-permission';
import { useGetListPermission } from '@/modules/permission/hooks/use-get-list-permission';
import {
    PermissionData,
    PermissionDataDataFilter,
} from '@/modules/permission/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

type Props = {};

export default function Permission({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);

    const dataEdit = useModalStore<PermissionData>((state) => state.dataEdit);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const { token } = theme.useToken();

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
    const { permissionData, isFetching, refetch } =
        useGetListPermission(dataFilter);
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('permission.label')}
                extra={
                    <CreateButton
                        canCreate={true}
                        text={messages('common.create')}
                        onClick={() => openModal(TYPE_MODAL_PERMISSION.CREATE)}
                    />
                }
            >
                <div className="app-header">
                    {/* <PermissionHeader
                        dataFilter={dataFilter}
                        onSearch={onSearch}
                    /> */}
                    {/* <PermissionActions
                        selectedRowKeys={selectedRow}
                        resetSelectedRows={() => handleResetSelectedRow()}
                    /> */}
                </div>
                <PermissionTable
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                        />
                    }
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
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={permissionData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={permissionData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_PERMISSION.CREATE && (
                    <PermissionCreateModal />
                )}

                {typeModal === TYPE_MODAL_PERMISSION.UPDATE && (
                    <PermissionUpdateModal />
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
            </PageContainer>
        </AppPageWrapper>
    );
}
