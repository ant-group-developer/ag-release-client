'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ArtistRoleHeader from '@/modules/artist-role/components/header';
import ArtistRoleFormModal from '@/modules/artist-role/components/modal/artist-role-form';
import { ArtistRoleTable } from '@/modules/artist-role/components/table';
import { TYPE_MODAL_ARTIST_ROLE } from '@/modules/artist-role/enums';
import { useDeleteArtistRole } from '@/modules/artist-role/hooks/use-delete-artist-role';
import { useGetListArtistRole } from '@/modules/artist-role/hooks/use-get-list-artist-role';
import {
    ArtistRoleData,
    ArtistRoleDataFilter,
} from '@/modules/artist-role/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ArtistRole({}: Props) {
    const messages = useTranslations();
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
    const dataEdit = useModalStore((state) => state.dataEdit as ArtistRoleData);
    const closeModal = useModalStore((state) => state.closeModal);
    const { artistsRolesData, isLoading, refetch, lastUpdatedAt } =
        useGetListArtistRole(dataFilter);
    const { deleteArtistRole } = useDeleteArtistRole();

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

    const handleRefresh = () => {
        refetch();
    };

    const handleDeleteArtistRole = () => {
        const variables: DeleteVariables<ArtistRoleData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };

        deleteArtistRole(variables);
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

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <ArtistRoleHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <ArtistRoleTable
                    dataSource={artistsRolesData.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: artistsRolesData.metadata.currentPage,
                        total: artistsRolesData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={artistsRolesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={artistsRolesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_ARTIST_ROLE.CREATE ||
                typeModal === TYPE_MODAL_ARTIST_ROLE.UPDATE) && (
                <ArtistRoleFormModal />
            )}

            {typeModal === TYPE_MODAL_ARTIST_ROLE.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => {
                        handleDeleteArtistRole();
                    }}
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                />
            )}
        </div>
    );
}
