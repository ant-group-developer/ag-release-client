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
import DealTypeFormModal from '@/modules/deal-types/components/modal/deal-type-form';
import DealTypeTable from '@/modules/deal-types/components/table';
import { TYPE_MODAL_DEAL_TYPE } from '@/modules/deal-types/enums';
import { useDeleteDealType } from '@/modules/deal-types/hooks/use-delete';
import { useGetListDealType } from '@/modules/deal-types/hooks/use-get-list';
import { DealTypeData, DealTypeDataFilter } from '@/modules/deal-types/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function DealTypePage({}: Props) {
    const messages = useTranslations();
    // const locale = useLocale();
    const { token } = theme.useToken();
    const openModal = useModalStore((state) => state.openModal);
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<DealTypeDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<DealTypeData>((state) => state.dataEdit);

    // apis
    const { dealTypeData, isFetching, refetch } =
        useGetListDealType(dataFilter);
    const { deleteDealType } = useDeleteDealType();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<DealTypeData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteDealType(variables);
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('dealType.label')}
                extra={
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() => openModal(TYPE_MODAL_DEAL_TYPE.CREATE)}
                    />
                }
            >
                <DealTypeTable
                    headerTitle={
                        <div className="flex items-center gap-2">
                            <AppSearch
                                className="max-w-52"
                                onChange={onSearch}
                                defaultValue={dataFilter.keyword}
                            />
                        </div>
                    }
                    sticky
                    dataSource={dealTypeData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dealTypeData.metadata.page,
                        total: dealTypeData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
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
                        backgroundColor: token.colorBgContainer,
                    }}
                    current={dealTypeData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={dealTypeData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_DEAL_TYPE.CREATE ||
                    typeModal === TYPE_MODAL_DEAL_TYPE.EDIT) && (
                    <DealTypeFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_DEAL_TYPE.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDelete()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} ${messages('dealType.label').toLowerCase()}`}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
