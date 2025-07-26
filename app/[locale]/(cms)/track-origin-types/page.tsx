'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import TrackOriginTypeHeader from '@/modules/track-origin-types/components/header';
import TrackOriginTypeFormModal from '@/modules/track-origin-types/components/modal/track-origin-type-form';
import { TrackOriginTypeTable } from '@/modules/track-origin-types/components/table';
import { TYPE_MODAL_TRACK_ORIGIN_TYPE } from '@/modules/track-origin-types/enums';
import { useDeleteTrackOriginType } from '@/modules/track-origin-types/hooks/use-delete-track-origin-type';
import { useGetListTrackOriginTypes } from '@/modules/track-origin-types/hooks/use-get-list-track-origin-types';
import {
    TrackOriginTypeData,
    TrackOriginTypeDataFilter,
} from '@/modules/track-origin-types/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TrackOriginTypes({}: Props) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<TrackOriginTypeDataFilter>({
        page: 1,
        pageSize: 10,
        createdAt: '',
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as TrackOriginTypeData
    );
    const closeModal = useModalStore((state) => state.closeModal);
    const { trackOriginTypesData, isLoading, refetch, lastUpdatedAt } =
        useGetListTrackOriginTypes(dataFilter);
    const { deleteTrackOriginType } = useDeleteTrackOriginType();

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
        const variables: DeleteVariables<TrackOriginTypeData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };

        deleteTrackOriginType(variables);
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
                <TrackOriginTypeHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <TrackOriginTypeTable
                    dataSource={trackOriginTypesData.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: trackOriginTypesData.metadata.currentPage,
                        total: trackOriginTypesData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={trackOriginTypesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={trackOriginTypesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_TRACK_ORIGIN_TYPE.CREATE ||
                typeModal === TYPE_MODAL_TRACK_ORIGIN_TYPE.UPDATE) && (
                <TrackOriginTypeFormModal />
            )}

            {typeModal === TYPE_MODAL_TRACK_ORIGIN_TYPE.DELETE && (
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
