'use client';
import useModalStore from '@/hooks/use-modal';
import AddArtistModal from '@/modules/artist/components/modal/add-artist';
import AudioPlayer from '@/modules/release-detail/release-tracks/audio-player';
import AddNewTrackModal from '@/modules/release-detail/release-tracks/modal/add-new-track-modal';
import ReleaseTracksTable from '@/modules/release-detail/release-tracks/table';
import {
    TYPE_MODAL_RELEASE,
    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
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
        // setTracks(tracks?.filter((track) => track?.id !== trackId));
    };

    const handleAddTracks = (newTracks: any[]) => {
        const currentTracks = formValues.tracks || [];
        const normalizedTracks = currentTracks.map((track: any) => {
            if (track.artist && !track.artists) {
                return {
                    ...track,
                    artists: [
                        {
                            name: track.artist,
                            role: 'Main Artist',
                            id: track.artist,
                        },
                    ],
                    artist: undefined,
                };
            }
            return track;
        });

        setFormValues({
            ...formValues,
            tracks: [...normalizedTracks, ...newTracks],
        });
    };

    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

    const handleAddArtistTrack = (values: any) => {
        try {
            const newArtistData = {
                name: values.name,
                role: values.role,
                id: values.name,
            };

            const updatedTracks = formValues.tracks.map((track: TrackData) => {
                if (track.id === dataEdit?.id) {
                    const isArtistExists = track.artists?.some(
                        (artist) => artist.name === newArtistData.name
                    );

                    if (!isArtistExists) {
                        return {
                            ...track,
                            artists: [...(track.artists || []), newArtistData],
                        };
                    }
                }
                return track;
            });

            setFormValues({
                ...formValues,
                tracks: updatedTracks,
            });
            closeModal();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    // const handleAddArtistRelease = (values: any) => {
    //     const isArtistEditModal =
    //         typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST;
    //     try {
    //         const newArtistData = {
    //             name: values.name,
    //             role: values.role,
    //             id: values.name,
    //         };
    //         const releaseArtists = formValues.artists || [];

    //         let updatedArtists;

    //         if (isArtistEditModal) {
    //             updatedArtists = releaseArtists.map((artist: any) =>
    //                 artist.name === dataEdit?.name
    //                     ? { ...artist, ...newArtistData }
    //                     : artist
    //             );
    //         } else {
    //             updatedArtists = [...releaseArtists, newArtistData];
    //         }

    //         setFormValues({
    //             ...formValues,
    //             artists: updatedArtists,
    //         });
    //     } catch (error) {
    //         console.error('Validation failed:', error);
    //     }
    // };

    // const handleRemoveArtistTrack = () => {
    //     const track = formValues?.tracks?.find(
    //         (track: TrackData) => track.id === dataEdit?.id
    //     );
    //     const newArtists = track?.filter(
    //         (artist: any) => artist.id !== dataEdit?.id
    //     );

    //     setFormValues({
    //         ...formValues,
    //         tracks: formValues.tracks?.filter(
    //             (track: TrackData) => track.id !== dataEdit?.id
    //         ),
    //     });
    // };

    return (
        <div>
            {/* <ListTracksReleaseHeader /> */}
            <ReleaseTracksTable
                dataSource={formValues?.tracks || []}
                rowSelection={rowSelection}
                handleRemoveTrack={handleRemoveTrack}
            />

            <AudioPlayer />

            {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                <AddNewTrackModal open onAddTracks={handleAddTracks} />
            )}

            {/* {(typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST ||
                typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST) && (
                <AddArtistModal onSubmit={handleAddArtistRelease} />
            )} */}

            {(typeModal === TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST ||
                typeModal ===
                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST) && (
                <AddArtistModal onSubmit={handleAddArtistTrack} />
            )}
        </div>
    );
}
