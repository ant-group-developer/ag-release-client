'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import DspHeader from '@/modules/dsp/components/header';
import DspFormModal from '@/modules/dsp/components/modal/dsp-form';
import { DspTable } from '@/modules/dsp/components/table';
import { TYPE_MODAL_DSP } from '@/modules/dsp/enums';
import { useDeleteDsp } from '@/modules/dsp/hooks/use-delete-dsp';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData, DspDataFilter } from '@/modules/dsp/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

export default function Dsp() {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DspDataFilter>({
        page: 1,
        pageSize: 21,
    });
    const { height, width } = useWindowSize();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as DspData);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const { dspData, isLoading, refetch, lastUpdatedAt } =
        useGetListDsp(dataFilter);
    const { deleteDsp } = useDeleteDsp();

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteDsp = () => {
        const variables: DeleteVariables<DspData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteDsp(variables);
    };

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <DspHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <DspTable
                    dataSource={dspData?.items}
                    scroll={{
                        x: SCREEN.MD,
                        y: getScrollYHeight(height, width, 40, 39),
                    }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dspData.metadata.currentPage,
                        total: dspData.metadata.totalItems,
                    }}
                    loading={isLoading}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dspData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={dspData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_DSP.DELETE && (
                <AppConfirm
                    open
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                    onCancel={closeModal}
                    onOk={() => handleDeleteDsp()}
                />
            )}

            {(typeModal === TYPE_MODAL_DSP.CREATE ||
                typeModal === TYPE_MODAL_DSP.UPDATE) && <DspFormModal />}
        </div>
    );
}
