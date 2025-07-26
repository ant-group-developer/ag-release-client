import axiosAuth from '@/api/axios-auth';
import { useSongStatus } from '@/app/hooks/useSongStatus';
import WaveformElement from '@/components/ui/wave-form-element/wave-form-element';
import { TrackData } from '@/modules/tracks/types';
import { useEffect, useState } from 'react';

export function TrackWaveform({ data }: { data: TrackData }) {
    const { id, audioFile } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);

    const [peakData, setPeakData] = useState<any>([]);

    useEffect(() => {
        if (audioFile?.peak?.urlRead) {
            axiosAuth
                .get(audioFile?.peak?.urlRead)
                .then((response) => {
                    setPeakData(response.data);
                })
                .catch((error) => {
                    console.error('Lỗi khi đọc file JSON:', error);
                });
        }
    }, [audioFile?.peak?.urlRead]);

    return (
        <WaveformElement
            peakData={peakData}
            playedTime={currentTimePlaying}
            songDuration={audioFile?.duration}
            playing={isPlaying}
            togglePlayback={() =>
                handlePlay({
                    url:
                        audioFile?.file?.urlRead ??
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                })
            }
            handleSeeking={(second) =>
                handleSeeking({
                    url:
                        audioFile?.file?.urlRead ??
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                    second,
                })
            }
        />
    );
}
