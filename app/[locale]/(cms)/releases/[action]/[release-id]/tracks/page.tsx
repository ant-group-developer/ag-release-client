'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import { PAGE_SIZE } from '@/constants/page-size';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useFilter } from '@/hooks/use-filter';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import DropUploadTracks from '@/modules/releases/components/drop-track-upload';
import AddNewTrackModal from '@/modules/releases/components/release-detail/release-tracks/modal/add-new-track';
import TrackDetailModal from '@/modules/releases/components/release-detail/release-tracks/modal/track-detail';
import ReleaseTracksTable from '@/modules/releases/components/release-detail/release-tracks/table';
import { TYPE_MODAL_RELEASE, TYPE_MODAL_TRACK } from '@/modules/releases/enums';
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
import { ConfigProvider, Empty, theme } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import TrackActions from './track-actions';

export default function Tracks() {
    // hooks - state
    const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);

    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);

    const { action } = useGetReleaseDetailRoute();
    const { deleteTracks } = useBulkDeleteTracks();

    const isEditAction = action === RELEASE_DETAIL_ACTION.EDIT;

    const { dataFilter, onChangePage } = useFilter<TrackDataFilter>({
        releaseId: formValues?.id as string,
        // fieldOrder: 'order',
        pageSize: 30,
    });

    // apis
    const { tracksData, isLoading, isFetching } = useGetListTracks(dataFilter);
    const { deleteTrack } = useDeleteTrack();
    const { deleteTrackArtist } = useDeleteTrackArtist();

    // func
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const handleRemoveTrack = () => {
        const variables: DeleteVariables<TrackData['id']> = {
            id: dataEdit.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteTrack(variables);
    };
    const handleRemoveTrackArtist = () => {
        const variable: DeleteVariables<TrackArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteTrackArtist(variable);
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

    // const
    const rowSelection: TableRowSelection<TrackData> = {
        selectedRowKeys: selectedRow,
        onChange: handleRowSelection,
        getCheckboxProps: (record: any) => ({
            disabled: !isEditAction,
        }),
    };
    const { token } = theme.useToken();
    // const { isDark } = useThemeMode();
    const customTheme = {
        token: {
            // colorBgContainerDisabled: isDark ? '#2a2a2a' : '#fff',
            colorTextDisabled: token?.colorText,
        },
    };

    useEffect(() => {
        const handleOpenDetailTrack = () => {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#tracks.')) {
                const parts = hash.split('.');
                let trackIndex;
                if (parts[0] === '#tracks') {
                    trackIndex = Number(parts[1]);
                }
                const trackData = tracksData?.items[trackIndex as number];
                openModal(TYPE_MODAL_RELEASE.DETAIL_TRACK_RELEASE, {
                    record: trackData,
                    index: trackIndex,
                });
            }
        };
        window.addEventListener('hashchange', handleOpenDetailTrack);
        return () => {
            window.removeEventListener('hashchange', handleOpenDetailTrack);
        };
    }, [typeModal, openModal, tracksData?.items]);

    return (
        <ConfigProvider theme={customTheme}>
            <div className="pb-4">
                <TrackActions selectedRowKeys={selectedRow} />
                <ReleaseTracksTable
                    className="!p-0"
                    dataSource={tracksData?.items}
                    rowSelection={rowSelection}
                    scroll={{ x: 'max-content' }}
                    // sticky={{ offsetHeader: 174 }}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: tracksData.metadata.currentPage,
                        total: tracksData.metadata.totalItems,
                    }}
                    locale={{
                        emptyText: isLoading ? (
                            <Empty />
                        ) : (
                            <DropUploadTracks disabled={!isEditAction} />
                        ),
                    }}
                />

                {/* <AppPagination
                    className="mb-4 rounded-b-[8px] bg-white"
                    align="end"
                    current={tracksData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={tracksData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                /> */}

                {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                    <AddNewTrackModal />
                )}

                {/* On checking to delete */}
                {/* {(typeModal === TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST ||
                    typeModal ===
                        TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST) && (
                    <ReleaseArtistModal isSetMainArtist />
                )} */}

                {(typeModal === TYPE_MODAL_TRACK_ARTIST.ADD ||
                    typeModal === TYPE_MODAL_TRACK_ARTIST.UPDATE) && (
                    <TrackArtistModal />
                )}

                {typeModal === TYPE_MODAL_RELEASE.DETAIL_TRACK_RELEASE && (
                    <TrackDetailModal />
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

                {/* {typeModal ===
                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST && (
                    <AppConfirm
                        open
                        modalTitle={messages('action.delete.title', {
                            label: '',
                        })}
                        paragraph={messages('action.delete.alert', {
                            label: '',
                        })}
                        onCancel={closeModal}
                        onOk={() => {}}
                    />
                )} */}

                {typeModal === TYPE_MODAL_TRACK_ARTIST.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.artist?.name,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrackArtist()}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.title,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrack()}
                    />
                )}
            </div>
        </ConfigProvider>
    );
}
