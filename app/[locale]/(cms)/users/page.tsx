'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { formattedDate, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';
import CreateUserModal from '@/modules/user/components/user-create';
import UserHeader from '@/modules/user/components/user-header';
import InviteUserModal from '@/modules/user/components/user-invite';
import UserTable from '@/modules/user/components/user-table';
import UpdateUserModal from '@/modules/user/components/user-update';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '@/modules/user/enums';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { useSyncUser } from '@/modules/user/hooks/use-sync-user';
import { DataFilterUser } from '@/modules/user/types/data';

type Props = {};

export default function UserPage({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const {
        dataFilter,
        canClearFilter,
        onChangeFilter,
        onChangePage,
        removeFilter,
    } = useFilter<DataFilterUser>({
        page: 1,
        pageSize: PAGE_SIZE,
        fieldOrder: USER_ORDER_BY.UPDATED_AT,
        orderBy: ORDER.DESC,
    });
    const { data, dataUpdatedAt, refetch, isFetching } =
        useUserList(dataFilter);
    const { syncUser, isPending } = useSyncUser();

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
            <UserHeader
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={() => refetch()}
                handleSync={() => syncUser({})}
                lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
            />
            <UserTable
                dataSource={data.items}
                scroll={{
                    y: scrollY,
                }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: data.metadata.currentPage,
                    total: data.metadata.totalItems,
                }}
                loading={isFetching || isPending}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

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
            {typeModal === TYPE_MODAL_USER.INVITE && (
                <InviteUserModal open onCancel={closeModal} />
            )}
        </div>
    );
}
