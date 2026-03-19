import { usePlaySongStore } from '@/hooks/use-play-song-store';
import { useEffect, useRef } from 'react';
// import ReactPlayer from 'react-player';

import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';

const ReactPlayerNoSSR = dynamic(() => import('react-player'), {
    ssr: false,
});

export default function AudioPlayer() {
    const { url, isPlaying, setReactPlayerRef, songId, currentTimePlaying } =
        usePlaySongStore();
    const playerRef = useRef<ReactPlayer>(null);

    // Bước 1: Cung cấp các phương thức điều khiển player cho store
    useEffect(() => {
        if (!playerRef.current) {
            setReactPlayerRef(null); // Đảm bảo store ref là null nếu player chưa sẵn sàng
            return;
        }
        setReactPlayerRef({
            seekTo: (second: number) => {
                if (playerRef.current) {
                    playerRef.current.seekTo(second, 'seconds');
                }
            },
            getCurrentTime: () => {
                return playerRef.current?.getCurrentTime() || 0;
            },
        });
        return () => {
            setReactPlayerRef(null);
        };
    }, [setReactPlayerRef, playerRef.current]);

    // Bước 2: Xử lý việc thiết lập thời gian khi phát
    useEffect(() => {
        if (playerRef.current && url && isPlaying) {
            // Đặt thời gian hiện tại của player từ store
            const storedTime = currentTimePlaying;
            const currentTime = playerRef.current.getCurrentTime();

            // Chỉ seek nếu thời gian khác nhau đáng kể (tránh seek liên tục)
            if (Math.abs(currentTime - storedTime) > 0.5) {
                playerRef.current.seekTo(storedTime, 'seconds');
            }
        }
    }, [isPlaying, url, songId, currentTimePlaying]);

    // Bước 3: Cập nhật liên tục thời gian phát hiện tại từ player vào store
    const onProgress = (state: { playedSeconds: number }) => {
        // Chỉ cập nhật thời gian vào store nếu đây là bài hát đang active
        if (usePlaySongStore.getState().songId === songId) {
            usePlaySongStore.setState((prevState) => ({
                ...prevState,
                currentTimePlaying: state.playedSeconds,
            }));
        }
    };

    // Xử lý khi bài hát kết thúc
    const onEnded = () => {
        if (usePlaySongStore.getState().songId === songId) {
            usePlaySongStore.setState((prevState) => ({
                ...prevState,
                isPlaying: false,
                currentTimePlaying: 0,
            }));
        }
    };

    // Xử lý lỗi phát nhạc
    const onError = (error: any) => {
        console.error('Lỗi phát nhạc:', error);
        if (usePlaySongStore.getState().songId === songId) {
            usePlaySongStore.setState((prevState) => ({
                ...prevState,
                isPlaying: false,
            }));
        }
    };

    return (
        <ReactPlayerNoSSR
            ref={playerRef}
            url={url}
            playing={isPlaying}
            width="0"
            height="0"
            style={{ display: 'none' }}
            onProgress={onProgress}
            onEnded={onEnded}
            onError={onError}
            progressInterval={500} // Cập nhật progress mỗi 500ms
            config={{
                file: {
                    forceAudio: true,
                },
            }}
        />
    );
}
