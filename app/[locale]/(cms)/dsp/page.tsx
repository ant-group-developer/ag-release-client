'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import DspFormModal from '@/modules/dsp/components/modal/dsp-form';
import { DspTable } from '@/modules/dsp/components/table';
import { dspQueryKeys } from '@/modules/dsp/constants/query-keys';
import { TYPE_MODAL_DSP } from '@/modules/dsp/enums';
import { useDeleteDsp } from '@/modules/dsp/hooks/use-delete-dsp';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData, DspDataFilter } from '@/modules/dsp/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

export default function Dsp() {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dataFilter, onChangePage, onSearch } = useFilter<DspDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<DspData>((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    const { isLoading } = useLoadingStatus({
        queryKeys: [dspQueryKeys.lists()],
        mutationKeys: [dspQueryKeys.all],
    });
    const openModal = useModalStore((state) => state.openModal);
    const { isSystemTenant } = useAuth();

    // apis
    const { dspData, isFetching, refetch, lastUpdatedAt } =
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('dsp.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
                extra={
                    <div className="">
                        {isSystemTenant && (
                            <CreateButton
                                canCreate={true}
                                text={messages('dsp.add')}
                                onClick={() => openModal(TYPE_MODAL_DSP.CREATE)}
                            />
                        )}
                    </div>
                }
            >
                {/* <DspHeader dataFilter={dataFilter} onSearch={onSearch} /> */}
                <DspTable
                    className="rounded-t-lg"
                    sticky
                    dataSource={dspData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dspData.metadata.currentPage,
                        total: dspData.metadata.totalItems,
                    }}
                    loading={isLoading}
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
                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
