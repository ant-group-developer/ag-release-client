import { usePlaySongStore } from '@/hooks/use-play-song-store';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export default function AudioPlayer() {
    const {
        url,
        isPlaying,
        setReactPlayerRef,
        songId,
        pendingSeekTime,
        pendingAutoPlay,
        setPendingSeekTime,
        setPendingAutoPlay,
        onStop,
    } = usePlaySongStore();
    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        if (!playerRef.current) {
            setReactPlayerRef(null);
            return;
        }

        setReactPlayerRef({
            seekTo: (second: number) => {
                playerRef.current?.seekTo(second, 'seconds');
            },
            getCurrentTime: () => {
                return playerRef.current?.getCurrentTime() || 0;
            },
        });

        return () => {
            setReactPlayerRef(null);
        };
    }, [setReactPlayerRef, url]);

    useEffect(() => {
        if (!playerRef.current || pendingSeekTime === null || pendingAutoPlay) {
            return;
        }

        const currentTime = playerRef.current.getCurrentTime();
        if (Math.abs(currentTime - pendingSeekTime) <= 0.5) {
            setPendingSeekTime(null);
            return;
        }

        playerRef.current.seekTo(pendingSeekTime, 'seconds');
    }, [pendingSeekTime, pendingAutoPlay, setPendingSeekTime]);

    const onReady = () => {
        if (!playerRef.current) {
            return;
        }

        if (pendingSeekTime !== null) {
            playerRef.current.seekTo(pendingSeekTime, 'seconds');
            setPendingSeekTime(null);
        }

        if (pendingAutoPlay) {
            usePlaySongStore.setState((prevState) => ({
                ...prevState,
                isPlaying: true,
                pendingAutoPlay: false,
            }));
        }
    };

    const onProgress = (state: { playedSeconds: number }) => {
        if (usePlaySongStore.getState().songId !== songId) {
            return;
        }

        usePlaySongStore.setState((prevState) => ({
            ...prevState,
            currentTimePlaying: state.playedSeconds,
        }));
    };

    const onEnded = () => {
        const activeSongId = usePlaySongStore.getState().songId;
        if (activeSongId !== songId) {
            return;
        }

        usePlaySongStore.setState((prevState) => {
            if (activeSongId) {
                prevState.songTimeMap.set(activeSongId, 0);
            }

            return {
                ...prevState,
                isPlaying: false,
                currentTimePlaying: 0,
                pendingSeekTime: null,
                pendingAutoPlay: false,
            };
        });
    };

    const onError = (error: unknown) => {
        console.error('Error playing audio:', error);

        if (usePlaySongStore.getState().songId !== songId) {
            return;
        }

        usePlaySongStore.setState((prevState) => ({
            ...prevState,
            isPlaying: false,
            pendingAutoPlay: false,
        }));
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => {
            onStop(false);
        };
    }, [onStop]);

    if (!mounted) return null;

    return (
        <ReactPlayer
            key={url || 'audio-player'}
            ref={playerRef}
            url={url}
            playing={isPlaying}
            width="0"
            height="0"
            style={{ display: 'none' }}
            onReady={onReady}
            onProgress={onProgress}
            onEnded={onEnded}
            onError={onError}
            progressInterval={500}
            config={{
                file: {
                    forceAudio: true,
                },
            }}
        />
    );
}
