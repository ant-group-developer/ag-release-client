import dynamic from 'next/dynamic';

interface WaveformElementProps {
    peakData?: number[];
    songDuration?: number;
    playedTime?: number;
    playing?: boolean;
    togglePlayback?: () => void;
    handleSeeking?: (value: any) => void;
}

// @ts-ignore
const Waveform = dynamic<any>(() => import('react-audio-waveform'), {
    ssr: false,
});

type Props = {};

export default function WaveElement({
    peakData = [],
    songDuration = 0,
    playedTime = 0,
    playing = false,
    togglePlayback = () => {},
    handleSeeking = (value: any) => {},
}: WaveformElementProps) {
    if (peakData.length === 0) {
        return null;
    }

    return (
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
    );
}
