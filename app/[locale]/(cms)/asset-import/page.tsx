'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import AssetImportBatchesHeader from '@/modules/asset-import/components/header';
import AssetImportDetailDrawer from '@/modules/asset-import/components/detail-drawer';
import ScanAssetImportModal from '@/modules/asset-import/components/scan-modal';
import AssetImportBatchesTable from '@/modules/asset-import/components/table';
import { TYPE_MODAL_ASSET_IMPORT } from '@/modules/asset-import/enums';
import { useDeleteAssetImportBatch } from '@/modules/asset-import/hooks/use-delete-batch';
import { useGetListAssetImportBatch } from '@/modules/asset-import/hooks/use-get-list-batches';
import { AssetImportBatchData, AssetImportBatchFilter } from '@/modules/asset-import/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function AssetImportPage() {
    const messages = useTranslations();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<AssetImportBatchFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<AssetImportBatchData>(
        (state) => state.dataEdit
    );

    const { assetImportBatchData, isFetching, refetch } =
        useGetListAssetImportBatch(dataFilter);
    const { deleteAssetImportBatch, isPending: isDeleting } =
        useDeleteAssetImportBatch();

    const handleDelete = () => {
        const variables: DeleteVariables<string> = {
            id: dataEdit?.id as string,
            onSuccess: () => {
                closeModal();
            },
        };

        deleteAssetImportBatch(variables);
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('assetImport.label')}>
                <AssetImportBatchesTable
                    title={() => (
                        <AssetImportBatchesHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                            onChangeFilter={onChangeFilter}
                            handleRefresh={refetch}
                            isFetching={isFetching}
                        />
                    )}
                    sticky
                    dataSource={assetImportBatchData.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: assetImportBatchData.metadata.page,
                    }}
                />
                <AppPagination
                    align="end"
                    current={assetImportBatchData.metadata.page}
                    pageSize={dataFilter.pageSize}
                    total={assetImportBatchData.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>

            <ScanAssetImportModal />

            <AssetImportDetailDrawer />

            {typeModal === TYPE_MODAL_ASSET_IMPORT.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={handleDelete}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.fileName,
                    })}
                    okButtonProps={{ loading: isDeleting }}
                />
            )}
        </AppPageWrapper>
    );
}
