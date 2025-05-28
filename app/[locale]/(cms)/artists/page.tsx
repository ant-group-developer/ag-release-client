'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { SCREEN } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ArtistsHeader from '@/modules/artist/components/header';
import ArtistFormModal from '@/modules/artist/components/modal/create-artist';
import { ArtistsTable } from '@/modules/artist/components/table';
import { fakeArtistData } from '@/modules/artist/constants';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { ArtistDataFilter } from '@/modules/artist/types';

import { fakeLabelData } from '@/modules/labels/constants';
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

    const handleRefresh = () => {};

    const { height, width } = useWindowSize();

    const isSmallDevice = Number(width) <= SCREEN.MD;

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
                    dataSource={fakeArtistData}
                    scroll={{ x: SCREEN.XXL, y: scrollY() }}
                />
            </div>

            {(typeModal === TYPE_MODAL_ARTIST.CREATE ||
                typeModal === TYPE_MODAL_ARTIST.UPDATE) && <ArtistFormModal />}

            {typeModal === TYPE_MODAL_ARTIST.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    modalTitle={`${messages('artist.delete')} `}
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ này không?"
                />
            )}

            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeLabelData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </div>
    );
}
