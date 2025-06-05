'use client';
import useModalStore from '@/hooks/use-modal';
import AudioPlayer from '@/modules/release-detail/release-tracks/audio-player';
import AddNewTrackModal from '@/modules/release-detail/release-tracks/modal/add-new-track-modal';
import ReleaseTracksTable from '@/modules/release-detail/release-tracks/table';
import { TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Key, useState } from 'react';

export default function Tracks() {
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const typeModal = useModalStore((state) => state.typeModal);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const handleRemoveTrack = (trackId: string) => {
        setTracks(tracks?.filter((track) => track?.id !== trackId));
    };

    const handleAddTracks = (newTracks: TrackData[]) => {
        setTracks([...tracks, ...newTracks]);
    };

    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

    return (
        <div>
            {/* <ListTracksReleaseHeader /> */}
            <ReleaseTracksTable
                dataSource={tracks}
                rowSelection={rowSelection}
                handleRemoveTrack={handleRemoveTrack}
            />

            <AudioPlayer />

            {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                <AddNewTrackModal open onAddTracks={handleAddTracks} />
            )}
        </div>
    );
}
