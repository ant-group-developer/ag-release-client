import { SIZE_ICON_BIG } from '@/constants/common';
import { convertSecondsToTime } from '@/helpers/common';
import { Button, Col, Row } from 'antd';
import { CirclePause, CirclePlay } from 'lucide-react';
// import dynamic from 'next/dynamic';
import WaveElement from './wave-element';

// import Waveform from 'react-audio-waveform';

// @ts-ignore
// const WaveElement = dynamic<any>(() => import('react-audio-waveform'), {
//     ssr: false,
// });

interface WaveformElementProps {
    peakData?: number[];
    songDuration?: number;
    playedTime?: number;
    playing?: boolean;
    togglePlayback?: () => void;
    handleSeeking?: (value: any) => void;
}

const WaveformElement = ({
    peakData = [],
    songDuration = 0,
    playedTime = 0,
    playing = false,
    togglePlayback = () => {},
    handleSeeking = (value: any) => {},
}: WaveformElementProps) => {
    return (
        <Row align="middle" wrap={false} className="min-h-10">
            <Col className="block" flex="50px">
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
            </Col>
            <Col flex="50px">{convertSecondsToTime(playedTime)}</Col>
            <Col flex="auto">
                <div
                    style={{
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <WaveElement
                        peakData={peakData}
                        handleSeeking={handleSeeking}
                        togglePlayback={togglePlayback}
                        playedTime={playedTime}
                        playing={playing}
                        songDuration={songDuration}
                    />
                </div>
            </Col>
            <Col flex="50px">{convertSecondsToTime(songDuration)}</Col>
        </Row>
    );
};

export default WaveformElement;
