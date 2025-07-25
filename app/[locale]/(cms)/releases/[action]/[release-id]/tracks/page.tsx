'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import AddNewTrackModal from '@/modules/releases/components/release-detail/release-tracks/modal/add-new-track-modal';
import ReleaseTracksTable from '@/modules/releases/components/release-detail/release-tracks/table';
import {
    TYPE_MODAL_RELEASE,
    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST,
    TYPE_MODAL_TRACK,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { useDeleteTrackArtist } from '@/modules/track-artist/hooks/use-delete-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useDeleteTrack } from '@/modules/tracks/hooks/use-delete-track';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData } from '@/modules/tracks/types';
import { DeleteVariables } from '@/types/api';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';

export default function Tracks() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const typeModal = useModalStore((state) => state.typeModal);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    const titleModal = messages('delete.confirmTitle');
    const paragraphModal = `${messages('delete.confirmMessage', { value: dataEdit?.artist?.name ?? '' })}`;

    const { tracksData, isLoading } = useGetListTracks({
        releaseId: formValues?.id as string,
        fieldOrder: 'order',
    });

    const { deleteTrack } = useDeleteTrack();

    const { deleteTrackArtist } = useDeleteTrackArtist();

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

    const handleAddTracks = (newTracks: any[]) => {};

    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

    const handleRemoveTrackArtist = () => {
        const variable: DeleteVariables<TrackArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteTrackArtist(variable);
    };

    useEffect(() => {
        if (tracksData?.items) {
            setFormValues({
                ...formValues,
                tracks: tracksData.items.map((track) => ({
                    ...track,
                    isSensitiveContent: !!track.isSensitiveContent,
                })),
            });
        }
    }, [tracksData?.items]);

    return (
        <div>
            <ReleaseTracksTable
                // dataSource={tracksData?.items}
                dataSource={formValues?.tracks ?? []}
                // rowSelection={rowSelection}
                loading={isLoading}
            />

            {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                <AddNewTrackModal open onAddTracks={handleAddTracks} />
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

            {typeModal ===
                TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle={titleModal}
                    paragraph={paragraphModal}
                    onCancel={closeModal}
                    onOk={() => {}}
                />
            )}

            {typeModal === TYPE_MODAL_TRACK_ARTIST.DELETE && (
                <AppConfirm
                    open
                    modalTitle={titleModal}
                    paragraph={paragraphModal}
                    onCancel={closeModal}
                    onOk={() => handleRemoveTrackArtist()}
                />
            )}

            {typeModal === TYPE_MODAL_TRACK.DELETE && (
                <AppConfirm
                    open
                    modalTitle={titleModal}
                    paragraph={paragraphModal}
                    onCancel={closeModal}
                    onOk={() => handleRemoveTrack()}
                />
            )}
        </div>
    );
}
