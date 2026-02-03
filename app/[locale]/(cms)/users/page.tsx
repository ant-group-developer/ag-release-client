'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { BOOLEAN_RAW, ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import CreateUserModal from '@/modules/user/components/user-create';
import UserHeaderV2 from '@/modules/user/components/user-header-v2';
import InviteUserModal from '@/modules/user/components/user-invite';
import UserTable from '@/modules/user/components/user-table';
import UpdateUserModal from '@/modules/user/components/user-update';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '@/modules/user/enums';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { useRemoveUser } from '@/modules/user/hooks/use-remove-user';
import { DataFilterUser, UserData } from '@/modules/user/types/data';
import { UserAddOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
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
    const { isNotSystemTenant } = useAuth();
    const openModal = useModalStore((state) => state.openModal);

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
        status: BOOLEAN_RAW.TRUE.toString(),
    });
    const { data, isFetching } = useUserList(dataFilter);
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
        <AppPageWrapper>
            <PageContainer
                title={messages('common.users')}
                extra={
                    <div className="flex items-center gap-2">
                        {isNotSystemTenant && (
                            <CreateButton
                                canCreate={true}
                                text={messages('action.invite.title', {
                                    label: messages('user.label'),
                                })}
                                onClick={() =>
                                    openModal(TYPE_MODAL_USER.INVITE)
                                }
                                ghost
                                icon={<UserAddOutlined />}
                            />
                        )}
                        <CreateButton
                            canCreate={true}
                            text={messages('action.create.title', {
                                label: messages('user.label'),
                            })}
                            onClick={() => openModal(TYPE_MODAL_USER.CREATE)}
                        />
                    </div>
                }
            >
                {/* <UserHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                /> */}

                <UserHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />

                <UserTable
                    sticky
                    dataSource={data.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: data.metadata.page,
                        total: data.metadata.totalItems,
                    }}
                    loading={isFetching || isPending}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                <AppPagination
                    align="end"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    current={data?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={data.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    className="!rounded-b-lg"
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
                            removeUser({
                                userId: dataEdit.id,
                                onSuccess: closeModal,
                            });
                        }}
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit.email,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
