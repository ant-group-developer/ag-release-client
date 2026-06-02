import { SIZE_ICON_BIG } from '@/constants/common';
import { convertSecondsToTime } from '@/helpers/common';
import { Button, Slider } from 'antd';
import { CirclePause, CirclePlay } from 'lucide-react';

interface SliderAudioPlayerProps {
    songDuration?: number;
    playedTime?: number;
    playing?: boolean;
    togglePlayback?: () => void;
    handleSeeking?: (value: number) => void;
}

const SliderAudioPlayer = ({
    songDuration = 0,
    playedTime = 0,
    playing = false,
    togglePlayback = () => {},
    handleSeeking = () => {},
}: SliderAudioPlayerProps) => {
    return (
        <div className="flex items-center">
            <Button
                type="text"
                shape="circle"
                onClick={togglePlayback}
                icon={
                    playing ? (
                        <div>
                            <CirclePause size={SIZE_ICON_BIG} />
                        </div>
                    ) : (
                        <div>
                            <CirclePlay size={SIZE_ICON_BIG} />
                        </div>
                    )
                }
            />
            <span className="w-[44px] pr-2 text-xs tabular-nums">
                {convertSecondsToTime(playedTime)}
            </span>
            <Slider
                className="flex-1"
                min={0}
                max={songDuration}
                step={0.1}
                value={playedTime}
                onChange={handleSeeking}
                tooltip={{
                    formatter: (val) => convertSecondsToTime(val || 0),
                }}
            />
            <span className="w-[44px] text-right text-xs tabular-nums">
                {convertSecondsToTime(songDuration)}
            </span>
        </div>
    );
};

export default SliderAudioPlayer;
