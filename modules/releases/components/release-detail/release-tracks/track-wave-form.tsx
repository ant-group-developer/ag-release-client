import axiosInstance from '@/api/axios-auth';
import { useSongStatus } from '@/app/hooks/useSongStatus';
import WaveformElement from '@/components/ui/wave-form-element/wave-form-element';
import { showNotification } from '@/helpers/messages-helper';
import { TrackData } from '@/modules/tracks/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';

export function TrackWaveform({ data }: { data: TrackData }) {
    const { id, audioFile } = data;
    const { isPlaying, handlePlay, currentTimePlaying, handleSeeking } =
        useSongStatus(id);
    const audioUrlRef = useRef<string | null>(null);
    const [peakData, setPeakData] = useState<any>([]);
    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });

    const { linkReadFile: linkReadFilePeak } = useGetLinkReadFile(
        audioFile?.peak?.id as string,
        {
            enabled: !!entry?.isIntersecting,
        }
    );

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
                handlePlay({
                    url: audioUrl,
                    songId: id,
                });
            }
        } else {
            handlePlay({
                url: audioUrlRef.current,
                songId: id,
            });
        }
    };

    const handleSeekingTrack = async (second: number) => {
        if (!audioUrlRef.current) {
            const audioUrl = await fetchAudioUrl();
            if (audioUrl) {
                handleSeeking({
                    url: audioUrl,
                    songId: id,
                    second,
                });
            }
        } else {
            handleSeeking({
                url: audioUrlRef.current,
                songId: id,
                second,
            });
        }
    };

    // const fetchPeakData = async () => {
    //     const response = await bucketApi.getLinkReadFile(
    //         audioFile?.peak?.id as string
    //     );
    //     setPeakData(response.data?.data || []);
    // };

    useEffect(() => {
        if (audioFile?.peak?.id && linkReadFilePeak) {
            axiosInstance
                .get(linkReadFilePeak)
                .then((response) => {
                    setPeakData(response.data);
                })
                .catch((error) => {
                    console.error('Lỗi khi đọc file JSON:', error);
                });
        }
    }, [audioFile?.peak?.id, linkReadFilePeak]);

    return (
        <div ref={ref}>
            <WaveformElement
                peakData={peakData}
                playedTime={currentTimePlaying}
                songDuration={audioFile?.duration}
                playing={isPlaying}
                togglePlayback={handlePlayTrack}
                handleSeeking={(second) => handleSeekingTrack(second)}
            />
        </div>
    );
}
