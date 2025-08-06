'use client';
import AppContent from '@/components/ant-music/app-content';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { getScrollYHeight, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ReleaseTypeHeader from '@/modules/release-types/components/header';
import ReleaseTypeFormModal from '@/modules/release-types/components/modal/release-type-form';
import { ReleaseTypeTable } from '@/modules/release-types/components/table';
import { TYPE_MODAL_RELEASE_TYPE } from '@/modules/release-types/enums';
import { useDeleteReleaseType } from '@/modules/release-types/hooks/use-delete-release-type';
import { useGetListReleaseTypes } from '@/modules/release-types/hooks/use-get-list-release-types';
import {
    ReleaseTypesData,
    ReleaseTypesDataFilter,
} from '@/modules/release-types/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ReleaseType({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleaseTypesDataFilter>({
        page: 1,
        pageSize: 28,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as ReleaseTypesData
    );
    const closeModal = useModalStore((state) => state.closeModal);
    const { height, width } = useWindowSize();

    // apis
    const { releaseTypesData, isLoading, refetch, lastUpdatedAt } =
        useGetListReleaseTypes(dataFilter);
    const { deleteReleaseType } = useDeleteReleaseType();

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteReleaseType = () => {
        const variables: DeleteVariables<ReleaseTypesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };

        deleteReleaseType(variables);
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
        <AppContent className="overflow-hidden">
            <div className="flex-1">
                <ReleaseTypeHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <ReleaseTypeTable
                    dataSource={releaseTypesData.items}
                    scroll={{
                        x: SCREEN.MD,
                        y: getScrollYHeight(height, width, 40, 38),
                    }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseTypesData.metadata.currentPage,
                        total: releaseTypesData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={releaseTypesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={releaseTypesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_RELEASE_TYPE.CREATE ||
                typeModal === TYPE_MODAL_RELEASE_TYPE.UPDATE) && (
                <ReleaseTypeFormModal />
            )}

            {typeModal === TYPE_MODAL_RELEASE_TYPE.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => {
                        handleDeleteReleaseType();
                    }}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}
        </AppContent>
    );
}
