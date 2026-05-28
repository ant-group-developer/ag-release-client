'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ReleaseVideoHeader from '@/modules/release-video/components/header';
import { ReleaseVideoTable } from '@/modules/release-video/components/table';
import { TYPE_MODAL_RELEASE_VIDEO } from '@/modules/release-video/enums';
import { useDeleteReleaseVideo } from '@/modules/release-video/hooks/use-delete-release-video';
import { useGetListReleaseVideo } from '@/modules/release-video/hooks/use-get-list-release-video';
import { ReleaseVideoData, ReleaseVideoDataFilter } from '@/modules/release-video/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function ReleaseVideos() {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReleaseVideoDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ReleaseVideoData>((state) => state.dataEdit);

    // apis
    const { releaseVideoData, isFetching, refetch } =
        useGetListReleaseVideo(dataFilter);
    const { deleteReleaseVideo } = useDeleteReleaseVideo();

    // func
    const handleDeleteReleaseVideo = () => {
        const variables: DeleteVariables<ReleaseVideoData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {},
        };

        deleteReleaseVideo(variables);
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
            <PageContainer title={messages('releaseVideo.title')}>
                <ReleaseVideoTable
                    title={() => (
                        <ReleaseVideoHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={releaseVideoData.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseVideoData.metadata.page,
                        total: releaseVideoData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={releaseVideoData.metadata?.page}
                    pageSize={dataFilter?.pageSize}
                    total={releaseVideoData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_RELEASE_VIDEO.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.videoTitle,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleDeleteReleaseVideo()}
                    />
                )}

            </PageContainer>
        </AppPageWrapper>
    );
}
