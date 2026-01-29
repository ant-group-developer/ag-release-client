'use client';
import AppContent from '@/components/ant-music/app-content';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CreateUserModal from '@/modules/user/components/user-create';
import UserHeaderV2 from '@/modules/user/components/user-header-v2';
import InviteUserModal from '@/modules/user/components/user-invite';
import UserTable from '@/modules/user/components/user-table';
import UpdateUserModal from '@/modules/user/components/user-update';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '@/modules/user/enums';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { useRemoveUser } from '@/modules/user/hooks/use-remove-user';
import { DataFilterUser, UserData } from '@/modules/user/types/data';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function UserPage({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();

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
    });
    const { data } = useUserList(dataFilter);
    const { removeUser } = useRemoveUser();

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
            {/* <div
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
                />
            </div> */}

            <div className="space-y-4">
                <UserHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />

                <UserTable
                    sticky={{ offsetHeader: 170 }}
                    dataSource={data.items}
                    // scroll={{ y: getScrollYHeight(height, width, 40, 47) }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: data.metadata.page,
                        total: data.metadata.totalItems,
                    }}
                    // loading={isFetching || isPending}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>

            <AppPagination
                align="end"
                current={data?.metadata?.page}
                pageSize={dataFilter.pageSize}
                total={data.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
                className="rounded-b-md"
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
