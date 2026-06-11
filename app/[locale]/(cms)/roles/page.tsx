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

import RolesFormModal from '@/modules/roles/components/modal/roles-form';
import { RolesTable } from '@/modules/roles/components/table';
import { TYPE_MODAL_ROLES } from '@/modules/roles/enums';
import { useBulkDeleteRoles } from '@/modules/roles/hooks/use-bulk-delete-roles';
import { useDeleteRole } from '@/modules/roles/hooks/use-delete-role';
import { useGetListRoles } from '@/modules/roles/hooks/use-get-list-roles';
import { RolesData, RolesDataDataFilter } from '@/modules/roles/types';
import { PageContainer } from '@ant-design/pro-components';
import { Select, Space, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

type Props = {};

export default function Roles({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<RolesData>((state) => state.dataEdit);
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
        columnWidth: 30,
    };

    // apis
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RolesDataDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            isActive: 'true',
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('role.roles')}
                extra={
                    <CreateButton
                        canCreate={true}
                        text={messages('common.create')}
                        onClick={() => openModal(TYPE_MODAL_ROLES.CREATE)}
                    />
                }
            >
                {/* <div className="app-header">
                    <RolesHeader dataFilter={dataFilter} onSearch={onSearch} />
                    <RolesActions
                        selectedRowKeys={selectedRow}
                        resetSelectedRows={() => handleResetSelectedRow()}
                    />
                </div> */}
                <RolesTable
                    sticky
                    dataSource={rolesData.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: rolesData.metadata.page,
                        total: rolesData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    rowSelection={rowSelection}
                    headerTitle={
                        <Space>
                            <AppSearch
                                className="max-w-52"
                                onChange={onSearch}
                                defaultValue={dataFilter.keyword}
                            />
                            <Select
                                style={{ width: 150 }}
                                options={[
                                    {
                                        label: messages('status.active'),
                                        value: 'true',
                                    },
                                    {
                                        label: messages('status.block'),
                                        value: 'false',
                                    },
                                ]}
                                value={dataFilter.isActive}
                                placeholder={messages('common.status')}
                                onChange={(value) =>
                                    onChangeFilter({ isActive: value })
                                }
                            />
                        </Space>
                    }
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
                    current={rolesData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={rolesData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_ROLES.CREATE ||
                    typeModal === TYPE_MODAL_ROLES.UPDATE) && (
                    <RolesFormModal />
                )}

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
            </PageContainer>
        </AppPageWrapper>
    );
}
