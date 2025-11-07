'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';

import LabelsHeader from '@/modules/labels/components/header';
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
        <div
            className="min-h-[calc(100vh-64px)]"
            style={{
                backgroundColor: token?.colorBgLayout,
            }}
        >
            <PageContainer
                title={messages('label.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
            >
                <LabelsHeader dataFilter={dataFilter} onSearch={onSearch} />
                <LabelsTable
                    className="rounded-t-lg"
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
        </div>
    );
}
