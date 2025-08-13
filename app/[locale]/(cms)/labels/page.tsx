'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';

import LabelsHeader from '@/modules/labels/components/header';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { LabelsTable } from '@/modules/labels/components/table';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import { useDeleteLabel } from '@/modules/labels/hooks/use-delete-label';
import { useGetListLabels } from '@/modules/labels/hooks/use-get-list-labels';
import { LabelData, LabelDataFilter } from '@/modules/labels/types';
import { DeleteVariables } from '@/types/api';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Labels({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<LabelDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<LabelData>((state) => state.dataEdit);

    // apis
    const { labelsData, isLoading, lastUpdatedAt, refetch } =
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
        <div>
            <LabelsHeader
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={handleRefresh}
                lastUpdatedAt={lastUpdatedAt}
            />
            <LabelsTable
                dataSource={labelsData?.items}
                scroll={{ y: scrollY }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: labelsData.metadata.currentPage,
                    total: labelsData.metadata.totalItems,
                }}
                loading={isLoading}
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
                className="border-b border-t"
                align="end"
                current={labelsData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={labelsData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
