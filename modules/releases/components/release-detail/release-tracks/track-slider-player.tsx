import SliderAudioPlayer from '@/components/ui/wave-form-element/slider-audio-player';
import { showNotification } from '@/helpers/messages-helper';
import { useSongStatus } from '@/hooks/use-song-status';
import { TrackData } from '@/modules/tracks/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useRef } from 'react';

export function TrackSliderPlayer({ data }: { data: TrackData }) {
    const { id, audioFile } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);
    const audioUrlRef = useRef<string | null>(null);

    const fetchAudioUrl = async () => {
        if (!audioUrlRef.current && audioFile?.file?.id) {
            try {
                const res = await bucketApi.getLinkReadFile(audioFile.file.id);
                audioUrlRef.current = res.data?.data ?? null;
            } catch (error) {
                showNotification('error', 'Failed to fetch audio file URL');
            }
        }
        return audioUrlRef.current;
    };

    const handlePlayTrack = async () => {
        if (!audioUrlRef.current) {
            const audioUrl = await fetchAudioUrl();
            if (audioUrl) {
                handlePlay({ url: audioUrl, songId: id });
            }
        } else {
            handlePlay({ url: audioUrlRef.current, songId: id });
        }
    };

    const handleSeekingTrack = async (second: number) => {
        if (!audioUrlRef.current) {
            const audioUrl = await fetchAudioUrl();
            if (audioUrl) {
                handleSeeking({ url: audioUrl, songId: id, second });
            }
        } else {
            handleSeeking({ url: audioUrlRef.current, songId: id, second });
        }
    };

    return (
        <SliderAudioPlayer
            playedTime={currentTimePlaying}
            songDuration={audioFile?.duration}
            playing={isPlaying}
            togglePlayback={handlePlayTrack}
            handleSeeking={(second) => handleSeekingTrack(second)}
        />
    );
}
