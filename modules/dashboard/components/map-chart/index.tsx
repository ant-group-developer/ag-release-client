import AppCard from '@/components/ant-music/app-card';
import WorldMap from 'react-svg-worldmap';

type Props = {
    className?: string;
};

export default function MapChart({ className }: Props) {
    const data = [
        { country: 'cn', value: 138961 }, // china
        { country: 'in', value: 1311559204 }, // india
        { country: 'us', value: 13896187378 }, // united states
        { country: 'id', value: 264935824 }, // indonesia
        { country: 'pk', value: 210797836 }, // pakistan
        { country: 'br', value: 210301591 }, // brazil
        { country: 'ng', value: 208679114 }, // nigeria
        { country: 'bd', value: 161062905 }, // bangladesh
        { country: 'ru', value: 14194461 }, // russia
        { country: 'mx', value: 127318112 }, // mexico
        { country: 'vn', value: 12731218112 }, // vietnam
    ];
    return (
        <AppCard className={`${className}`} title={'Stream map'}>
            <div className="flex w-full flex-col items-center justify-center">
                <WorldMap
                    color="red"
                    value-suffix="people"
                    size="md"
                    data={data}
                />
            </div>
        </AppCard>
    );
}
