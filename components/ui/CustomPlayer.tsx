import IconButton from '@/components/ui/button/icon-button'; // Đảm bảo đường dẫn đúng
import { Fullscreen, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

interface CustomPlayerProps extends ReactPlayerProps {
    showPlayButton?: boolean;
    showFullscreenButton?: boolean;
}

export const CustomPlayer = ({
    showPlayButton = true,
    showFullscreenButton = true,
    ...props
}: CustomPlayerProps) => {
    const playerRef = useRef<ReactPlayer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreen = () => {
        const videoElement = playerRef.current?.getInternalPlayer();
        setIsFullscreen(true);
        if (videoElement && videoElement.requestFullscreen) {
            videoElement.requestFullscreen(); // Mở video ở fullscreen
        }
    };

    useEffect(() => {
        const checkFullscreen = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', checkFullscreen);
        return () => {
            document.removeEventListener('fullscreenchange', checkFullscreen);
        };
    }, []);

    const handleVideoClick = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-lg">
            {/* ReactPlayer */}
            <ReactPlayer
                ref={playerRef}
                playing={isPlaying}
                width="100%"
                height="100%"
                controls={isFullscreen}
                onClick={handleVideoClick}
                {...props}
            />

            {/* Nút Play (hiện khi chưa phát) */}
            {!isPlaying && showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center rounded text-white">
                    <IconButton onClick={handleVideoClick}>
                        <Play />
                    </IconButton>
                </div>
            )}

            {/* Nút Fullscreen (hiện khi đang phát) */}
            {isPlaying && !isFullscreen && showFullscreenButton && (
                <div className="absolute bottom-0 right-0 rounded text-white">
                    <IconButton onClick={handleFullscreen}>
                        <Fullscreen />
                    </IconButton>
                </div>
            )}
        </div>
    );
};
