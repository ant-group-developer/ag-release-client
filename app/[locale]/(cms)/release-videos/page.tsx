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
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function ReleaseVideos() {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReleasesDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            type: RELEASE_TYPE.VIDEO,
            orderBy: ORDER.DESC,
            fieldOrder: 'updatedAt',
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ReleasesData>((state) => state.dataEdit);

    // apis
    const { releasesData, isFetching } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();

    // func
    const handleDeleteReleaseVideo = () => {
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {},
        };

        deleteRelease(variables);
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
            <PageContainer title={messages('releaseVideo.routeLabel')}>
                <ReleaseVideoTable
                    title={() => (
                        <ReleaseVideoHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={releasesData.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData.metadata.page,
                        total: releasesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={releasesData.metadata?.page}
                    pageSize={dataFilter?.pageSize}
                    total={releasesData.metadata?.totalItems}
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
                            value: dataEdit?.title,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleDeleteReleaseVideo()}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
