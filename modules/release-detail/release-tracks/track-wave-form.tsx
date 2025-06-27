import { useSongStatus } from '@/app/hooks/useSongStatus';
import WaveformElement from '@/components/ui/wave-form-element/wave-form-element';
import { TrackData } from '@/modules/tracks/types';

export function TrackWaveform({ data }: { data: TrackData }) {
    const { id, songInfo } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);

    return (
        <WaveformElement
            peakData={songInfo?.peakData.join(';')}
            playedTime={currentTimePlaying}
            songDuration={songInfo?.duration}
            playing={isPlaying}
            togglePlayback={() =>
                handlePlay({
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                })
            }
            handleSeeking={(second) =>
                handleSeeking({
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    songId: id,
                    second,
                })
            }
        />
    );
}
