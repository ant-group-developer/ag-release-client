'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';

import TrackSensitiveHeader from '@/modules/track-sensitive/components/header';
import TrackSensitiveFormModal from '@/modules/track-sensitive/components/modal/track-sensitive-form';
import { TrackSensitiveTable } from '@/modules/track-sensitive/components/table';
import { TYPE_MODAL_TRACK_SENSITIVE } from '@/modules/track-sensitive/enum';
import { useDeleteTrackSensitive } from '@/modules/track-sensitive/hooks/use-delete-track-sensitive';
import { useGetListTrackSensitive } from '@/modules/track-sensitive/hooks/use-get-list-track-sensitive';
import {
    TrackSensitiveData,
    TrackSensitiveFilter,
} from '@/modules/track-sensitive/types';
import { DeleteVariables } from '@/types/api';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TrackSensitive({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<TrackSensitiveFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TrackSensitiveData>(
        (state) => state.dataEdit
    );

    // apis
    const { trackSensitiveData, isFetching, refetch } =
        useGetListTrackSensitive(dataFilter);
    const { deleteTrackSensitive } = useDeleteTrackSensitive();

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteSensitiveContent = () => {
        const variables: DeleteVariables<TrackSensitiveData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteTrackSensitive(variables);
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
        <AppContainer title={messages('trackSensitive.label')}>
            <TrackSensitiveHeader dataFilter={dataFilter} onSearch={onSearch} />
            <TrackSensitiveTable
                sticky
                dataSource={trackSensitiveData?.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: trackSensitiveData.metadata.currentPage,
                    total: trackSensitiveData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            {(typeModal === TYPE_MODAL_TRACK_SENSITIVE.CREATE ||
                typeModal === TYPE_MODAL_TRACK_SENSITIVE.EDIT) && (
                <TrackSensitiveFormModal onCancel={closeModal} />
            )}

            {typeModal === TYPE_MODAL_TRACK_SENSITIVE.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDeleteSensitiveContent()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('trackSensitive.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}

            <AppPagination
                align="end"
                current={trackSensitiveData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={trackSensitiveData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </AppContainer>
    );
}
