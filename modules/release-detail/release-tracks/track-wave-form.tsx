import { useSongStatus } from '@/app/hooks/useSongStatus';
import WaveformElement from '@/components/ui/wave-form-element/wave-form-element';
import { getPeakData } from '@/helpers/common';
import { TrackData } from '@/modules/tracks/types';
import { useEffect, useState } from 'react';

export function TrackWaveform({ data }: { data: TrackData }) {
    const [peakData, setPeakData] = useState<number[]>([]);
    const [duration, setDuration] = useState<number>(0);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const { file, id } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);

    useEffect(() => {
        if (file) {
            const newBlobUrl = URL.createObjectURL(file);
            setBlobUrl(newBlobUrl);
            getPeakData(file).then((res) => {
                setPeakData(res.peakData);
                setDuration(res.songDuration);
            });
            return () => {
                URL.revokeObjectURL(newBlobUrl); // Giải phóng bộ nhớ khi component bị hủy hoặc file thay đổi
            };
        } else {
            setBlobUrl(null);
        }
    }, [file]);
    return (
        <WaveformElement
            peakData={peakData.join(';')}
            playedTime={currentTimePlaying}
            songDuration={duration}
            playing={isPlaying}
            togglePlayback={() =>
                handlePlay({
                    url: URL.createObjectURL(file),
                    songId: id,
                })
            }
            handleSeeking={(second) =>
                handleSeeking({ url: blobUrl || '', songId: id, second })
            }
        />
    );
}
