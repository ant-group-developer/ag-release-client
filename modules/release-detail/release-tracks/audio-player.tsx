import { usePlaySongStore } from '@/app/hooks/usePlaySongStore';
import { useEffect, useRef } from 'react';

export default function AudioPlayer() {
    const { url, isPlaying, setReactPlayerRef, songId, currentTimePlaying } =
        usePlaySongStore();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Bước 1: Cung cấp các phương thức điều khiển player cho store
    useEffect(() => {
        if (!audioRef.current) {
            setReactPlayerRef(null); // Đảm bảo store ref là null nếu audio element chưa sẵn sàng
            return;
        }
        setReactPlayerRef({
            seekTo: (second: number) => {
                if (audioRef.current) {
                    audioRef.current.currentTime = second;
                }
            },
            getCurrentTime: () => {
                return audioRef.current?.currentTime || 0;
            },
        });
        return () => {
            setReactPlayerRef(null);
        };
    }, [setReactPlayerRef, audioRef.current]);

    // Bước 2: Play/Pause dựa trên trạng thái từ store và thiết lập thời gian khi phát
    useEffect(() => {
        if (audioRef.current && url) {
            // Chỉ xử lý nếu có ref và URL hợp lệ
            if (isPlaying) {
                // Đặt thời gian hiện tại của audio element từ store
                const storedTime = currentTimePlaying;
                if (audioRef.current.currentTime !== storedTime) {
                    audioRef.current.currentTime = storedTime;
                }
                audioRef.current
                    .play()
                    .catch((e) => console.error('Lỗi phát nhạc:', e));
            } else {
                audioRef.current.pause();
            }
        } else if (audioRef.current && !url) {
            // Nếu không có URL, dừng và reset
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isPlaying, url, songId, currentTimePlaying]);

    // Bước 3: Cập nhật liên tục thời gian phát hiện tại từ player vào store
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            // Chỉ cập nhật thời gian vào store nếu đây là bài hát đang active
            if (usePlaySongStore.getState().songId === songId) {
                usePlaySongStore.setState((state) => ({
                    ...state,
                    currentTimePlaying: audio.currentTime,
                }));
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [songId, audioRef.current]); // Chạy lại hiệu ứng nếu songId thay đổi (để đảm bảo lắng nghe đúng bài hát)

    return <audio ref={audioRef} src={url} style={{ display: 'none' }} />;
}
