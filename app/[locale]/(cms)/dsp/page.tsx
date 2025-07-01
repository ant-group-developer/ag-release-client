'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import DspHeader from '@/modules/dsp/components/header';
import DspFormModal from '@/modules/dsp/components/modal/dsp-form';
import { DspTable } from '@/modules/dsp/components/table';
import { TYPE_MODAL_DSP } from '@/modules/dsp/enums';
import { useDeleteDsp } from '@/modules/dsp/hooks/use-delete-dsp';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData, DspDataFilter } from '@/modules/dsp/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

const fakeDspData: DspData[] = [
    {
        id: '1',
        name: 'Spotify',
        picture: 'https://picsum.photos/seed/spotify/60/60',
        canLinkArtistProfile: true,
        creatorId: 'admin',
        createdAt: '2024-06-01T10:00:00.000Z',
        updatedAt: '2024-06-10T10:00:00.000Z',
    },
    {
        id: '2',
        name: 'Apple Music',
        picture: 'https://picsum.photos/seed/applemusic/60/60',
        canLinkArtistProfile: false,
        creatorId: 'admin',
        createdAt: '2024-05-15T09:00:00.000Z',
        updatedAt: '2024-06-05T09:00:00.000Z',
    },
    {
        id: '3',
        name: 'YouTube Music',
        picture: 'https://picsum.photos/seed/youtubemusic/60/60',
        canLinkArtistProfile: true,
        creatorId: 'admin',
        createdAt: '2024-04-20T08:00:00.000Z',
        updatedAt: '2024-05-01T08:00:00.000Z',
    },
];

export default function Dsp({}: {}) {
    const messages = useTranslations();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DspDataFilter>({
        page: 1,
        pageSize: 21,
    });

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

    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as DspData);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleRefresh = () => {};

    const { dspData, isLoading } = useGetListDsp(dataFilter);

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    const { deleteDsp } = useDeleteDsp();
    const handleDeleteDsp = () => {
        const variables: DeleteVariables<DspData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteDsp(variables);
    };

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <DspHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <DspTable
                    dataSource={dspData?.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dspData.metadata.currentPage,
                        total: dspData.metadata.totalItems,
                    }}
                    loading={isLoading}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dspData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={dspData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_DSP.DELETE && (
                <AppConfirm
                    open
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                    onCancel={closeModal}
                    onOk={() => handleDeleteDsp()}
                />
            )}

            {(typeModal === TYPE_MODAL_DSP.CREATE ||
                typeModal === TYPE_MODAL_DSP.UPDATE) && <DspFormModal />}
        </div>
    );
}
