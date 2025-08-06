'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import {
    formattedDate,
    getScrollYHeight,
    setSortOrder,
} from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';

import { useDeleteLabel } from '@/modules/labels/hooks/use-delete-label';
import { LabelData } from '@/modules/labels/types';
import CreateUserModal from '@/modules/user/components/user-create';
import UserHeader from '@/modules/user/components/user-header';
import UserTable from '@/modules/user/components/user-table';
import UpdateUserModal from '@/modules/user/components/user-update';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '@/modules/user/enums';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { DataFilterUser } from '@/modules/user/types/data';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function UserPage({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DataFilterUser>({
        page: 1,
        pageSize: 21,
        fieldOrder: USER_ORDER_BY.UPDATED_AT,
        orderBy: ORDER.DESC,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const { height, width } = useWindowSize();

    // apis
    const { data, isLoading, dataUpdatedAt, refetch } = useUserList(dataFilter);
    const { deleteLabel } = useDeleteLabel();

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteLabel = () => {
        const variables: DeleteVariables<LabelData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteLabel(variables);
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
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <UserHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={formattedDate(dataUpdatedAt)}
                />
                <UserTable
                    dataSource={data.items}
                    scroll={{ y: getScrollYHeight(height, width, 40, 47) }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: data.metadata.currentPage,
                        total: data.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>

            <AppPagination
                className="border-b border-t"
                align="end"
                current={data?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={data.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_USER.CREATE && (
                <CreateUserModal open onCancel={closeModal} />
            )}

            {typeModal === TYPE_MODAL_USER.UPDATE && (
                <UpdateUserModal open onCancel={closeModal} />
            )}
        </div>
    );
}
