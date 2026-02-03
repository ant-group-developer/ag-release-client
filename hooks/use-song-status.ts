import { useEffect, useState } from 'react';
import { OnPlay, OnSeek, usePlaySongStore } from './use-play-song-store';

interface UseSongStatusProps {
    //   peakData: string;
    //   duration: number | string;
    url: string;
}

export const useSongStatus = (id: string) => {
    const {
        onSeek,
        onStop,
        onPlay,
        isPlaying: playing,
        currentTimePlaying: currentTime,
        songId,
    } = usePlaySongStore();

    const [playStatus, setPlayStatus] = useState({
        isPlaying: false,
        currentTimePlaying: 0,
    });

    const { isPlaying } = playStatus;

    const handleSeeking = (value: OnSeek) => {
        onSeek(value);
    };

    const handlePlay = (value: OnPlay) => {
        if (songId === id) {
            if (playing) {
                onStop(false);
            } else {
                onPlay(value);
            }
        } else {
            onPlay(value);
        }
    };

    useEffect(() => {
        if (songId === id) {
            setPlayStatus({
                isPlaying: playing,
                currentTimePlaying: currentTime,
            });
        } else {
            setPlayStatus((prev) => ({
                ...prev,
                isPlaying: false,
                // currentTimePlaying: 0,
            }));
        }
    }, [playing, currentTime, id, songId]);

    return {
        handleSeeking,
        handlePlay,
        ...playStatus,
    };
};
