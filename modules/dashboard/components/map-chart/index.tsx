import WorldMap from 'react-svg-worldmap';

type Props = {};

export default function MapChart({}: Props) {
    const data = [
        { country: 'cn', value: 1389618778 }, // china
        { country: 'in', value: 1311559204 }, // india
        { country: 'us', value: 331883986 }, // united states
        { country: 'id', value: 264935824 }, // indonesia
        { country: 'pk', value: 210797836 }, // pakistan
        { country: 'br', value: 210301591 }, // brazil
        { country: 'ng', value: 208679114 }, // nigeria
        { country: 'bd', value: 161062905 }, // bangladesh
        { country: 'ru', value: 141944641 }, // russia
        { country: 'mx', value: 127318112 }, // mexico
    ];
    return (
        <div className="rounded-lg border">
            <p className="px-6 py-4 pb-4 text-left text-base font-bold">
                Stream map
            </p>
            <div className="flex w-full flex-col items-center justify-center">
                <WorldMap
                    color="red"
                    value-suffix="people"
                    size="xl"
                    data={data}
                />
            </div>
        </div>
    );
}
