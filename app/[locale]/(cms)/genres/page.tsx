'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
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
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

export default function Genres({}: {}) {
    const messages = useTranslations();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<GenresDataFilter>({
        page: 1,
        pageSize: 21,
    });

    const { genresData, isLoading } = useGetListGenres(dataFilter);
    const { deleteGenre } = useDeleteGenre();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as GenresData);
    const isUpdateForm = !!dataEdit?.id;
    const handleRefresh = () => {};

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

    const handleDeleteGenre = () => {
        const variables: DeleteVariables<GenresData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
            }
        };

        deleteGenre(variables);
    };

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <GenresHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <GenresTable
                    dataSource={genresData.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: genresData.metadata.currentPage,
                        total: genresData.metadata.totalItems,
                    }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
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
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                    onCancel={closeModal}
                    onOk={() => handleDeleteGenre()}
                />
            )}

            {(typeModal === TYPE_MODAL_GENRES.CREATE ||
                typeModal === TYPE_MODAL_GENRES.UPDATE) && <GenresFormModal />}
        </div>
    );
}
