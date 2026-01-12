'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import TrackTypeHeader from '@/modules/track-types/components/header';
import TrackTypeFormModal from '@/modules/track-types/components/modal/track-type-form';
import { TrackTypeTable } from '@/modules/track-types/components/table';
import { trackTypeQueryKeys } from '@/modules/track-types/constants/query-keys';
import { TYPE_MODAL_TRACK_TYPE } from '@/modules/track-types/enums';
import { useDeleteTrackType } from '@/modules/track-types/hooks/use-delete-track-type';
import { useGetListTrackTypes } from '@/modules/track-types/hooks/use-get-list-track-types';
import {
    TrackTypeData,
    TrackTypeDataFilter,
} from '@/modules/track-types/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TrackTypes({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<TrackTypeDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as TrackTypeData);
    const closeModal = useModalStore((state) => state.closeModal);
    const { isLoading } = useLoadingStatus({
        queryKeys: [trackTypeQueryKeys.lists()],
        mutationKeys: [trackTypeQueryKeys.all],
    });

    // apis
    const { trackTypesData, refetch, lastUpdatedAt } =
        useGetListTrackTypes(dataFilter);
    const { deleteTrackType } = useDeleteTrackType();

    // func
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

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('trackType.label')}
                content={messages('trackType.description')}
            >
                <TrackTypeTable
                    title={() => (
                        <TrackTypeHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={trackTypesData.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: trackTypesData.metadata.currentPage,
                        total: trackTypesData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={trackTypesData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={trackTypesData.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    hideOnSinglePage
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
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
