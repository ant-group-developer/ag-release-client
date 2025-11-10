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
import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';

import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { LabelsTable } from '@/modules/labels/components/table';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import { useDeleteLabel } from '@/modules/labels/hooks/use-delete-label';
import { useGetListLabels } from '@/modules/labels/hooks/use-get-list-labels';
import { LabelData, LabelDataFilter } from '@/modules/labels/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Labels({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<LabelDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<LabelData>((state) => state.dataEdit);
    const openModal = useModalStore((state) => state.openModal);
    const { isNotSystemTenant } = useAuth();
    const { hasPermission } = usePermission();

    // apis
    const { labelsData, isFetching, lastUpdatedAt, refetch } =
        useGetListLabels(dataFilter);
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
        <AppPageWrapper>
            <PageContainer
                title={messages('label.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
                extra={
                    <div className="flex items-center gap-2">
                        {isNotSystemTenant &&
                            hasPermission(PERMISSION.LABEL.CREATE) && (
                                <CreateButton
                                    canCreate={true}
                                    text={messages('label.create')}
                                    onClick={() =>
                                        openModal(TYPE_MODAL_LABEL.CREATE)
                                    }
                                />
                            )}
                    </div>
                }
            >
                {/* <LabelsHeader dataFilter={dataFilter} onSearch={onSearch} /> */}
                <LabelsTable
                    sticky
                    dataSource={labelsData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: labelsData.metadata.currentPage,
                        total: labelsData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                        />
                    }
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                {(typeModal === TYPE_MODAL_LABEL.CREATE ||
                    typeModal === TYPE_MODAL_LABEL.EDIT) && (
                    <LabelFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_LABEL.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDeleteLabel()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} label`}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}

                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={labelsData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={labelsData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
