'use client';
import { SIZE_ICON_BIG } from '@/constants/common';
import { convertSecondsToTime } from '@/helpers/common';
import { Button, Col, Row, Spin } from 'antd';
import { CirclePause, CirclePlay } from 'lucide-react';
import dynamic from 'next/dynamic';
// import Waveform from 'react-audio-waveform';
const Waveform = dynamic<any>(
    () => import('react-audio-waveform').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-10 items-center justify-center">
                <Spin spinning />
            </div>
        ),
    }
);

interface WaveformElementProps {
    peakData?: number[];
    songDuration?: number;
    playedTime?: number;
    playing?: boolean;
    togglePlayback?: () => void;
    handleSeeking?: (value: any) => void;
}

const WaveformElement = ({
    peakData = [0],
    songDuration = 0,
    playedTime = 0,
    playing = false,
    togglePlayback = () => {},
    handleSeeking = (value: any) => {},
}: WaveformElementProps) => {
    // const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) {
    //     return (
    //         <Row align="middle" wrap={false} className="min-h-10">
    //             <Col flex="50px">
    //                 <Button type="text" shape="circle" disabled />
    //             </Col>
    //             <Col flex="50px">00:00</Col>
    //             <Col flex="auto">
    //                 <div style={{ height: 40, background: '#f5f5f5' }} />
    //             </Col>
    //             <Col flex="50px">00:00</Col>
    //         </Row>
    //     );
    // }
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
            <Col flex="50px">
                {/* <StyledSongItemDuration className="text-left"> */}
                {convertSecondsToTime(playedTime)}
                {/* </StyledSongItemDuration> */}
            </Col>
            <Col flex="auto">
                <div
                    style={{
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    {(peakData.length > 0 && (
                        <Waveform
                            key={`${songDuration}-${peakData.length}`}
                            peaks={peakData}
                            height={40}
                            pos={playedTime}
                            duration={songDuration}
                            onClick={handleSeeking}
                            color="#c7c7c9"
                            progressColor="#009AEE"
                            transitionDuration={100}
                        />
                    )) ||
                        null}
                </div>
            </Col>
            <Col flex="50px">
                {/* <StyledSongItemDuration> */}
                {convertSecondsToTime(songDuration)}
                {/* </StyledSongItemDuration> */}
            </Col>
        </Row>
    );
};

export default WaveformElement;

// WaveformElement.propTypes = {
//     peakData: PropTypes.any,
//     songDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     playing: PropTypes.bool,
//     playedTime: PropTypes.number,
//     togglePlayback: PropTypes.func,
//     /**
//      * Hàm callback khi seek, nhận giá trị seek từ waveform
//      */
//     handleSeeking: PropTypes.func,
// };
