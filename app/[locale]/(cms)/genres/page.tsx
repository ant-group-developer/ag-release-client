'use client';
import AppContent from '@/components/ant-music/app-content';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { getScrollYHeight, setSortOrder } from '@/helpers/common';
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

export default function Genres() {
    // hooks - state
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
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as GenresData);
    const { height, width } = useWindowSize();

    // apis
    const { genresData, isLoading, refetch, lastUpdatedAt } =
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
        <AppContent className="overflow-hidden">
            <div className="flex-1">
                <GenresHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <GenresTable
                    dataSource={genresData.items}
                    scroll={{
                        x: SCREEN.MD,
                        y: getScrollYHeight(height, width, 40, 39),
                    }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: genresData.metadata.currentPage,
                        total: genresData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
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
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                    onCancel={closeModal}
                    onOk={() => handleDeleteGenre()}
                />
            )}

            {(typeModal === TYPE_MODAL_GENRES.CREATE ||
                typeModal === TYPE_MODAL_GENRES.UPDATE) && <GenresFormModal />}
        </AppContent>
    );
}
