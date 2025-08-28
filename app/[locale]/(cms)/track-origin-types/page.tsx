'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
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
import { useTranslations } from 'next-intl';

type Props = {};

export default function TrackOriginTypes({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<TrackOriginTypeDataFilter>({
            page: 1,
            pageSize: 10,
            createdAt: '',
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as TrackOriginTypeData
    );
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const { trackOriginTypesData, isFetching, refetch, lastUpdatedAt } =
        useGetListTrackOriginTypes(dataFilter);
    const { deleteTrackOriginType } = useDeleteTrackOriginType();

    // func
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

    return (
        <AppContainer title={messages('trackOriginType.label')}>
            <TrackOriginTypeHeader
                dataFilter={dataFilter}
                onSearch={onSearch}
            />
            <TrackOriginTypeTable
                sticky
                dataSource={trackOriginTypesData.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: trackOriginTypesData.metadata.currentPage,
                    total: trackOriginTypesData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />
            <AppPagination
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
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}
        </AppContainer>
    );
}
