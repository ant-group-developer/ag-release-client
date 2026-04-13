'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { toastPromise } from '@/helpers/messages-helper';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import DropUploadTracks from '@/modules/releases/components/drop-track-upload';
import AddNewTrackModal from '@/modules/releases/components/release-detail/release-tracks/modal/add-new-track';
import TrackDetailModal from '@/modules/releases/components/release-detail/release-tracks/modal/track-detail';
import ReleaseTracksTable from '@/modules/releases/components/release-detail/release-tracks/table';
import TrackActions from '@/modules/releases/components/release-detail/release-tracks/track-actions';
import {
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
    TYPE_MODAL_TRACK,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { useDeleteTrackArtist } from '@/modules/track-artist/hooks/use-delete-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useBulkDeleteTracks } from '@/modules/tracks/hooks/use-bulk-delete-tracks';
import { useDeleteTrack } from '@/modules/tracks/hooks/use-delete-track';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData, TrackDataFilter } from '@/modules/tracks/types';
import { DeleteVariables } from '@/types/api';
import { Button, ConfigProvider, Empty, theme } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Key, useState } from 'react';

export default function Tracks() {
    // hooks - state
    const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const pathname = usePathname();
    const headerHeight = useElementHeightById('release-header');

    const formValues = useReleaseFormStore((state) => state.formValues);
    // const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    // const openModal = useModalStore((state) => state.openModal);
    const openModal = useModalStore((state) => state.openModal);

    // const { action } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((state) => state.action);
    const { deleteTracks } = useBulkDeleteTracks();
    const { deleteTrackArtist } = useDeleteTrackArtist();

    const isReleaseReadAction = releaseAction === RELEASE_DETAIL_ACTION.READ;

    const { dataFilter } = useFilter<TrackDataFilter>({
        releaseId: formValues?.id as string,
        fieldOrder: 'order',
        pageSize: 999,
    });

    // apis
    const { tracksData, isLoading, isFetching } = useGetListTracks(dataFilter);
    const { deleteTrack } = useDeleteTrack();

    // func
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const handleRemoveTrack = () => {
        closeModal();
        const variables: DeleteVariables<TrackData['id']> = {
            id: dataEdit.id,
        };
        const promise = deleteTrack(variables);
        return toastPromise(promise, messages);
    };

    const handleBulkDeleteTracks = () => {
        deleteTracks({
            ids: selectedRow,
            onSuccess: () => {
                closeModal();
                setSelectedRow([]);
            },
        });
    };
    const handleRemoveTrackArtist = () => {
        const trackArtistData = dataEdit as TrackArtistData;
        const variable = {
            id: trackArtistData?.id as string,
        };

        deleteTrackArtist(variable);
    };

    // const
    const rowSelection: TableRowSelection<TrackData> = {
        selectedRowKeys: selectedRow,
        onChange: handleRowSelection,
        getCheckboxProps: (record: any) => ({
            disabled: isReleaseReadAction,
        }),
    };
    const { token } = theme.useToken();
    const customTheme = {
        token: {
            colorTextDisabled: token?.colorText,
        },
    };
    const isTracksPage = pathname.includes(`/${RELEASES_TABS.TRACKS}`);
    const isShowAddTrack = releaseAction == RELEASE_DETAIL_ACTION.EDIT;

    return (
        <ConfigProvider theme={customTheme}>
            <div className="pb-4">
                <div className="mb-2 flex justify-end">
                    {isTracksPage && isShowAddTrack && (
                        <Button
                            icon={
                                <div>
                                    <Music size={SIZE_ICON} />
                                </div>
                            }
                            onClick={() =>
                                openModal(TYPE_MODAL_RELEASE.ADD_TRACK)
                            }
                            type="primary"
                        >
                            {messages('track.add')}
                        </Button>
                    )}
                </div>
                <TrackActions selectedRowKeys={selectedRow} />
                <ReleaseTracksTable
                    className="!p-0"
                    dataSource={tracksData?.items}
                    rowSelection={rowSelection}
                    sticky={{ offsetHeader: headerHeight }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: tracksData.metadata.page,
                        total: tracksData.metadata.totalItems,
                    }}
                    locale={{
                        emptyText: isLoading ? (
                            <Empty />
                        ) : (
                            <DropUploadTracks disabled={isReleaseReadAction} />
                        ),
                    }}
                />

                {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                    <AddNewTrackModal />
                )}

                {typeModal === TYPE_MODAL_RELEASE.DETAIL_TRACK_RELEASE && (
                    <TrackDetailModal tracks={tracksData?.items} />
                )}

                {typeModal === TYPE_MODAL_TRACK_ARTIST.ADD && (
                    <TrackArtistModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_TRACK.BULK_DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('action.delete.title', {
                            label: '',
                        })}
                        paragraph={messages('action.delete.alert', {
                            label: '',
                        })}
                        onCancel={closeModal}
                        onOk={handleBulkDeleteTracks}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('action.delete.alert', {
                            label: dataEdit?.title,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrack()}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK_ARTIST.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages.rich('delete.confirmMessageValue', {
                            value: dataEdit?.artist?.name,
                            b: (chuck) => <strong>{chuck}</strong>,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrackArtist()}
                    />
                )}
            </div>
        </ConfigProvider>
    );
}
