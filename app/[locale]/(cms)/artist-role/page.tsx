'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';

import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
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
import { useTranslations } from 'next-intl';

type Props = {};

export default function ArtistRole({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ArtistRoleDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<ArtistRoleData>((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    const { artistsRolesData, isLoading, refetch, dataUpdatedAt } =
        useGetListArtistRole(dataFilter);
    const { deleteArtistRole } = useDeleteArtistRole();

    // func
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

    return (
        <AppContainer title={messages('artist.role')}>
            <ArtistRoleHeader dataFilter={dataFilter} onSearch={onSearch} />
            <ArtistRoleTable
                sticky
                dataSource={artistsRolesData.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: artistsRolesData.metadata.currentPage,
                    total: artistsRolesData.metadata.totalItems,
                }}
                loading={isLoading}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />
            <AppPagination
                className="border-t"
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
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}
        </AppContainer>
    );
}
