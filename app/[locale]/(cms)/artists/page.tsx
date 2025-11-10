'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { ArtistsTable } from '@/modules/artist/components/table';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { useDeleteArtist } from '@/modules/artist/hooks/use-delete-artist';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData, ArtistDataFilter } from '@/modules/artist/types';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';

import { useTranslations } from 'next-intl';

type Props = {};

export default function Artists({}: Props) {
    // hooks - state
    const openModal = useModalStore((state) => state.openModal);
    const { hasPermission } = usePermission();
    const messages = useTranslations();
    const { token } = theme.useToken();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
        onSearch,
    } = useFilter<ArtistDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ArtistData>((state) => state.dataEdit);

    // api
    const { deleteArtist } = useDeleteArtist();
    const { artistsData, isFetching, lastUpdatedAt, refetch } =
        useGetListArtist(dataFilter);

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteArtist = () => {
        const variables: DeleteVariables<ArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteArtist(variables);
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
                title={messages('artist.label')}
                extra={
                    <>
                        {hasPermission(PERMISSION.ARTIST.CREATE) && (
                            <CreateButton
                                canCreate={true}
                                text={messages('artist.create')}
                                onClick={() =>
                                    openModal(TYPE_MODAL_ARTIST.CREATE)
                                }
                            />
                        )}
                    </>
                }
            >
                {/* <ArtistsHeader dataFilter={dataFilter} onSearch={onSearch} /> */}
                <ArtistsTable
                    sticky
                    dataSource={artistsData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: artistsData.metadata.currentPage,
                        total: artistsData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
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
                    current={artistsData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={artistsData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_ARTIST.CREATE ||
                    typeModal === TYPE_MODAL_ARTIST.UPDATE) && (
                    <ArtistFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_ARTIST.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDeleteArtist()}
                        onCancel={closeModal}
                        modalTitle={`${messages('artist.delete')} `}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
