'use client';
import AppContent from '@/components/ant-music/app-content';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { formattedDate, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CreateUserModal from '@/modules/user/components/user-create';
import UserHeader from '@/modules/user/components/user-header';
import InviteUserModal from '@/modules/user/components/user-invite';
import UserTable from '@/modules/user/components/user-table';
import UpdateUserModal from '@/modules/user/components/user-update';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '@/modules/user/enums';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { useRemoveUser } from '@/modules/user/hooks/use-remove-user';
import { DataFilterUser, UserData } from '@/modules/user/types/data';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function UserPage({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<UserData>((state) => state.dataEdit);

    // apis
    const {
        dataFilter,
        canClearFilter,
        onChangeFilter,
        onChangePage,
        removeFilter,
    } = useFilter<DataFilterUser>({
        page: 1,
        pageSize: 21,
        fieldOrder: USER_ORDER_BY.UPDATED_AT,
        orderBy: ORDER.DESC,
        tenantIds: tenantId,
    });
    const { data, dataUpdatedAt, refetch, isFetching } =
        useUserList(dataFilter);
    const { removeUser, isPending } = useRemoveUser();

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
        <AppContent className="">
            <div
                className="sticky top-44 z-10 border-t"
                style={{
                    background: token.colorBgContainer,
                }}
            >
                <UserHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={() => refetch()}
                    lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
                />
            </div>
            <UserTable
                sticky={{ offsetHeader: 216 }}
                dataSource={data.items}
                // scroll={{ y: getScrollYHeight(height, width, 40, 47) }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: data.metadata.currentPage,
                    total: data.metadata.totalItems,
                }}
                // loading={isFetching || isPending}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            <AppPagination
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

            {typeModal === TYPE_MODAL_USER.REMOVE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => {
                        removeUser({ userId: dataEdit.id });
                    }}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit.email,
                    })}
                />
            )}
        </AppContent>
    );
}
