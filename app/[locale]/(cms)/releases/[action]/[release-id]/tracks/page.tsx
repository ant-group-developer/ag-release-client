'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import AddArtistModal from '@/modules/artist/components/modal/add-artist';
import AudioPlayer from '@/modules/release-detail/release-tracks/audio-player';
import AddNewTrackModal from '@/modules/release-detail/release-tracks/modal/add-new-track-modal';
import ReleaseTracksTable from '@/modules/release-detail/release-tracks/table';
import {
    TYPE_MODAL_RELEASE,
    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Key, useState } from 'react';

export default function Tracks() {
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const typeModal = useModalStore((state) => state.typeModal);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const handleRemoveTrack = (trackId: string) => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.filter(
                (track) => track?.id !== trackId
            ),
        });
    };

    const handleAddTracks = (newTracks: any[]) => {};

    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

    const handleAddArtistTrack = (values: any) => {
        // try {
        //     const newArtistData: ArtistData = {
        //         name: values.name,
        //         id: values.name,
        //         createdAt: new Date().toDateString(),
        //     };
        //     const updatedTracks = formValues?.tracks?.map(
        //         (track: TrackData) => {
        //             if (track.id === dataEdit?.id) {
        //                 const isArtistExists = track.artists?.some(
        //                     (artist) => artist.name === newArtistData.name
        //                 );
        //                 if (!isArtistExists) {
        //                     return {
        //                         ...track,
        //                         artists: [
        //                             ...(track.artists || []),
        //                             newArtistData,
        //                         ],
        //                     };
        //                 }
        //             }
        //             return track;
        //         }
        //     );
        //     setFormValues({
        //         ...formValues,
        //         tracks: updatedTracks,
        //     });
        //     closeModal();
        // } catch (error) {
        //     console.error('Validation failed:', error);
        // }
    };

    const handleRemoveArtistTrack = (values: any) => {
        // const { trackData, artist } = values;
        // const updatedTracks = formValues?.tracks?.map((track: TrackData) => {
        //     if (track.id === trackData?.id) {
        //         return {
        //             ...track,
        //             artists: track.artists?.filter(
        //                 (item) => item.id !== artist.id
        //             ),
        //         };
        //     }
        //     return track;
        // });
        // setFormValues({
        //     ...formValues,
        //     tracks: updatedTracks,
        // });
        // closeModal();
    };

    return (
        <div>
            <ReleaseTracksTable
                dataSource={formValues?.tracks || []}
                rowSelection={rowSelection}
                handleRemoveTrack={handleRemoveTrack}
            />

            <AudioPlayer />

            {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                <AddNewTrackModal open onAddTracks={handleAddTracks} />
            )}

            {(typeModal === TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST ||
                typeModal ===
                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST) && (
                <AddArtistModal onSubmit={handleAddArtistTrack} />
            )}

            {typeModal ===
                TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle="Xóa nghệ sĩ"
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ ra khỏi bài hát này không?"
                    onCancel={closeModal}
                    onOk={() => handleRemoveArtistTrack(dataEdit)}
                />
            )}
        </div>
    );
}
