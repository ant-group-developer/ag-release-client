'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import DspHeader from '@/modules/dsp/components/header';
import DspFormModal from '@/modules/dsp/components/modal/dsp-form';
import { DspTable } from '@/modules/dsp/components/table';
import { TYPE_MODAL_DSP } from '@/modules/dsp/enums';
import { DspData, DspDataFilter } from '@/modules/dsp/types';

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

    const typeModal = useModalStore((state) => state.typeModal);
    const handleRefresh = () => {};

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
                    dataSource={fakeDspData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeDspData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />

            {(typeModal === TYPE_MODAL_DSP.CREATE ||
                typeModal === TYPE_MODAL_DSP.UPDATE) && <DspFormModal />}
        </div>
    );
}
