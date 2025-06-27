'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ArtistRoleHeader from '@/modules/artist-role/components/header';
import ArtistRoleFormModal from '@/modules/artist-role/components/modal/artist-role-form';
import { ArtistRoleTable } from '@/modules/artist-role/components/table';
import { fakeArtistRoleData } from '@/modules/artist-role/constants';
import { TYPE_MODAL_ARTIST_ROLE } from '@/modules/artist-role/enums';
import { ArtistRoleDataFilter } from '@/modules/artist-role/types';

type Props = {};

export default function ArtistRole({}: Props) {
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<ArtistRoleDataFilter>({
        page: 1,
        pageSize: 10,
        createdAt: '',
    });
    const typeModal = useModalStore((state) => state.typeModal);

    const handleRefresh = () => {};

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <ArtistRoleHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <ArtistRoleTable
                    dataSource={fakeArtistRoleData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeArtistRoleData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />

            {(typeModal === TYPE_MODAL_ARTIST_ROLE.CREATE ||
                typeModal === TYPE_MODAL_ARTIST_ROLE.UPDATE) && (
                <ArtistRoleFormModal />
            )}
        </div>
    );
}
