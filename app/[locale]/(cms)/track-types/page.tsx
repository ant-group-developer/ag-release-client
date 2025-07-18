'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import TrackTypeHeader from '@/modules/track-types/components/header';
import TrackTypeFormModal from '@/modules/track-types/components/modal/track-type-form';
import { TrackTypeTable } from '@/modules/track-types/components/table';
import { TYPE_MODAL_TRACK_TYPE } from '@/modules/track-types/enums';
import { useDeleteTrackType } from '@/modules/track-types/hooks/use-delete-track-type';
import { useGetListTrackTypes } from '@/modules/track-types/hooks/use-get-list-track-types';
import {
    TrackTypeData,
    TrackTypeDataFilter,
} from '@/modules/track-types/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TrackTypes({}: Props) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<TrackTypeDataFilter>({
        page: 1,
        pageSize: 10,
        createdAt: '',
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as TrackTypeData);
    const closeModal = useModalStore((state) => state.closeModal);
    const { trackTypesData, isLoading, refetch, lastUpdatedAt } =
        useGetListTrackTypes(dataFilter);
    const { deleteTrackType } = useDeleteTrackType();

    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const appHeaderHeight = 65;
        const pageHeaderHeight = 53;
        const tableHeaderHeight = 39;
        const paginationHeight = 55;
        const value =
            height -
            appHeaderHeight -
            pageHeaderHeight -
            tableHeaderHeight -
            paginationHeight;

        return value > minHeight ? value : minHeight;
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleDeleteTrackType = () => {
        const variables: DeleteVariables<TrackTypeData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };

        deleteTrackType(variables);
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

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <TrackTypeHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <TrackTypeTable
                    dataSource={trackTypesData.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: trackTypesData.metadata.currentPage,
                        total: trackTypesData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={trackTypesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={trackTypesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_TRACK_TYPE.CREATE ||
                typeModal === TYPE_MODAL_TRACK_TYPE.UPDATE) && (
                <TrackTypeFormModal />
            )}

            {typeModal === TYPE_MODAL_TRACK_TYPE.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => {
                        handleDeleteTrackType();
                    }}
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                />
            )}
        </div>
    );
}
