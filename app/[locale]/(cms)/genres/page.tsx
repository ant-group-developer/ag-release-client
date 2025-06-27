'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import GenresHeader from '@/modules/genres/components/header';
import GenresFormModal from '@/modules/genres/components/modal/genres-form';
import { GenresTable } from '@/modules/genres/components/table';
import { TYPE_MODAL_GENRES } from '@/modules/genres/enums';
// import GenresFormModal nếu có
// import { fakeGenresData } from '@/modules/genres/constants';
import { GenresData, GenresDataFilter } from '@/modules/genres/types';

const fakeGenresData: GenresData[] = [
    {
        id: '1',
        name: 'Pop',
        picture: 'https://picsum.photos/seed/pop/60/60',
        description: 'Nhạc Pop hiện đại',
        createdAt: '2024-06-01T10:00:00.000Z',
        updatedAt: '2024-06-10T10:00:00.000Z',
    },
    {
        id: '2',
        name: 'Rock',
        picture: 'https://picsum.photos/seed/rock/60/60',
        description: 'Nhạc Rock sôi động',
        createdAt: '2024-05-15T09:00:00.000Z',
        updatedAt: '2024-06-05T09:00:00.000Z',
    },
    {
        id: '3',
        name: 'Jazz',
        picture: 'https://picsum.photos/seed/jazz/60/60',
        description: 'Nhạc Jazz nhẹ nhàng',
        createdAt: '2024-04-20T08:00:00.000Z',
        updatedAt: '2024-05-01T08:00:00.000Z',
    },
];

export default function Genres({}: {}) {
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
    const handleRefresh = () => {};

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
                    dataSource={fakeGenresData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeGenresData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />

            {(typeModal === TYPE_MODAL_GENRES.CREATE ||
                typeModal === TYPE_MODAL_GENRES.UPDATE) && <GenresFormModal />}
        </div>
    );
}
