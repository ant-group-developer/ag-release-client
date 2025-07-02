'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ArtistsHeader from '@/modules/artist/components/header';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { ArtistsTable } from '@/modules/artist/components/table';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { useDeleteArtist } from '@/modules/artist/hooks/use-delete-artist';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData, ArtistDataFilter } from '@/modules/artist/types';
import { DeleteVariables } from '@/types/api';

import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Artists({}: Props) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<ArtistDataFilter>({
        page: 1,
        pageSize: 21,
    });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const { deleteArtist } = useDeleteArtist();

    const handleRefresh = () => {};

    const { height, width } = useWindowSize();

    const isSmallDevice = Number(width) <= SCREEN.MD;

    const { artistsData } = useGetListArtist(dataFilter);

    const modalParagraph = messages('delete.confirmMessage', {
        value: dataEdit?.name,
    });

    const handleDeleteArtist = () => {
        const variables: DeleteVariables<ArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteArtist(variables);
    };

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        // const headerFooterHeight = 216;
        const headerFooterHeight = 210;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
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
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <ArtistsHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <ArtistsTable
                    dataSource={artistsData?.items}
                    scroll={{ x: SCREEN.XXL, y: scrollY() }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: artistsData.metadata.currentPage,
                        total: artistsData.metadata.totalItems,
                    }}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                />
            </div>

            {(typeModal === TYPE_MODAL_ARTIST.CREATE ||
                typeModal === TYPE_MODAL_ARTIST.UPDATE) && <ArtistFormModal />}

            {typeModal === TYPE_MODAL_ARTIST.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDeleteArtist()}
                    onCancel={closeModal}
                    modalTitle={`${messages('artist.delete')} `}
                    paragraph={modalParagraph}
                />
            )}

            <AppPagination
                className="border-b border-t"
                align="end"
                current={artistsData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={artistsData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
