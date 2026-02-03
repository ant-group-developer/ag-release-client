'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ActionsHeader from '@/modules/actions/components/header';
import ActionsFormModal from '@/modules/actions/components/modal/actions-form';
import { ActionsTable } from '@/modules/actions/components/table';
import { TYPE_MODAL_ACTIONS } from '@/modules/actions/enums';
import { useDeleteAction } from '@/modules/actions/hooks/use-delete-action';
import { useGetListActions } from '@/modules/actions/hooks/use-get-list-actions';
import { ActionsDataFilter } from '@/modules/actions/types';

import { RolesData } from '@/modules/roles/types';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Actions({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<RolesData>((state) => state.dataEdit);

    // apis
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ActionsDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { actionsData, isFetching } = useGetListActions(dataFilter);
    const { deleteAction } = useDeleteAction();

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
            <PageContainer title={messages('policy.policies')}>
                <ActionsTable
                    title={() => (
                        <ActionsHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={actionsData.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: actionsData.metadata.page,
                        total: actionsData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                <AppPagination
                    align="end"
                    current={actionsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={actionsData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_ACTIONS.CREATE ||
                    typeModal === TYPE_MODAL_ACTIONS.UPDATE) && (
                    <ActionsFormModal />
                )}

                {typeModal === TYPE_MODAL_ACTIONS.DELETE && (
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
                            deleteAction({
                                id: dataEdit?.id,
                                onSuccess: () => closeModal(),
                            })
                        }
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
