import axiosAuth from '@/api/axios-auth';
import { useSongStatus } from '@/app/hooks/useSongStatus';
import WaveformElement from '@/components/ui/wave-form-element/wave-form-element';
import { TrackData } from '@/modules/tracks/types';
import { useEffect, useState } from 'react';

export function TrackWaveform({ data }: { data: TrackData }) {
    const { id, audioFileBucket } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);

    const [peakData, setPeakData] = useState<any>([]);

    useEffect(() => {
        if (audioFileBucket?.peak) {
            axiosAuth
                .get(audioFileBucket.peak)
                .then((response) => {
                    setPeakData(response.data);
                })
                .catch((error) => {
                    console.error('Lỗi khi đọc file JSON:', error);
                });
        }
    }, [audioFileBucket?.peak]);

    return (
        <WaveformElement
            peakData={peakData}
            playedTime={currentTimePlaying}
            songDuration={audioFileBucket?.duration}
            playing={isPlaying}
            togglePlayback={() =>
                handlePlay({
                    url:
                        audioFileBucket?.file ??
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                })
            }
            handleSeeking={(second) =>
                handleSeeking({
                    url:
                        audioFileBucket?.file ??
                        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                    second,
                })
            }
        />
    );
}
