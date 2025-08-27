'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
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
import { useTranslations } from 'next-intl';

export default function Dsp() {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangePage, onSearch } = useFilter<DspDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<DspData>((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const { dspData, isLoading, refetch, lastUpdatedAt } =
        useGetListDsp(dataFilter);
    const { deleteDsp } = useDeleteDsp();

    // func
    const handleDeleteDsp = () => {
        const variables: DeleteVariables<DspData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteDsp(variables);
    };

    return (
        <AppContainer title={messages('artist.label')}>
            <DspHeader dataFilter={dataFilter} onSearch={onSearch} />
            <DspTable
                sticky
                dataSource={dspData?.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: dspData.metadata.currentPage,
                    total: dspData.metadata.totalItems,
                }}
                loading={isLoading}
            />
            <AppPagination
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
        </AppContainer>
    );
}
