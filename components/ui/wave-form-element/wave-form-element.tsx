import { convertSecondsToTime, parsePeakData } from '@/helpers/common';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import Waveform from 'react-audio-waveform';
// import { StyledSongItemDuration, StyledSongItemPlayback } from './index.styled';

const WaveformElement = ({
    peakData = '',
    songDuration = 0,
    playedTime = 0,
    playing = false,
    togglePlayback = () => {},
    handleSeeking = () => {},
}) => {
    // const peaks = (peakData && peakData.split(';')) || [];
    const peaks = parsePeakData(peakData);

    return (
        <Row align="middle" wrap={false}>
            <Col className="block lg:hidden" flex="50px">
                {/* <StyledSongItemPlayback
                    onClick={togglePlayback}
                    icon={
                        playing ? (
                            <Pause size={SIZE_ICON} />
                        ) : (
                            <Play size={SIZE_ICON} />
                        )
                    }
                /> */}
            </Col>
            <Col flex="50px">
                {/* <StyledSongItemDuration className="text-left"> */}
                {convertSecondsToTime(playedTime)}
                {/* </StyledSongItemDuration> */}
            </Col>
            <Col flex="auto">
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    {(peaks.length > 0 && (
                        <Waveform
                            peaks={peaks}
                            height={40}
                            pos={playedTime}
                            duration={songDuration}
                            onClick={handleSeeking}
                            color="#c7c7c9"
                            progressColor="tomato"
                            transitionDuration={100}
                        />
                    )) ||
                        null}
                </div>
            </Col>
            <Col flex="70px">
                {/* <StyledSongItemDuration>
                    {convertSecondsToTime(songDuration)}
                </StyledSongItemDuration> */}
            </Col>
        </Row>
    );
};

export default WaveformElement;

WaveformElement.propTypes = {
    peakData: PropTypes.any,
    songDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    playing: PropTypes.bool,
    playedTime: PropTypes.number,
    togglePlayback: PropTypes.func,
    handleSeeking: PropTypes.func,
};
