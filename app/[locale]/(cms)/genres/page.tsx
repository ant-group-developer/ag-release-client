'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import GenresHeader from '@/modules/genres/components/header';
import GenresFormModal from '@/modules/genres/components/modal/genres-form';
import { GenresTable } from '@/modules/genres/components/table';
import { TYPE_MODAL_GENRES } from '@/modules/genres/enums';
import { useDeleteGenre } from '@/modules/genres/hooks/use-delete-genre';
import { useGetListGenres } from '@/modules/genres/hooks/use-get-list-genres';
// import GenresFormModal nếu có
// import { fakeGenresData } from '@/modules/genres/constants';
import { GenresData, GenresDataFilter } from '@/modules/genres/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function Genres() {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<GenresDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<GenresData>((state) => state.dataEdit);

    // apis
    const { genresData, isFetching, refetch, lastUpdatedAt } =
        useGetListGenres(dataFilter);
    const { deleteGenre } = useDeleteGenre();

    // const
    const isUpdateForm = !!dataEdit?.id;

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteGenre = () => {
        const variables: DeleteVariables<GenresData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {},
        };

        deleteGenre(variables);
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
            <PageContainer title={messages('genre.genres')}>
                <GenresTable
                    title={() => (
                        <GenresHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={genresData.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: genresData.metadata.currentPage,
                        total: genresData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={genresData.metadata?.currentPage}
                    pageSize={dataFilter?.pageSize}
                    total={genresData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_GENRES.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleDeleteGenre()}
                    />
                )}

                {(typeModal === TYPE_MODAL_GENRES.CREATE ||
                    typeModal === TYPE_MODAL_GENRES.UPDATE) && (
                    <GenresFormModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
