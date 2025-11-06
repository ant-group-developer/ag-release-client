import { Card } from 'antd';
import WorldMap from 'react-svg-worldmap';
import { CountryCountData } from '../../types';

type Props = {
    className?: string;
    data: CountryCountData[];
};

export default function MapChart({ data, className }: Props) {
    const countData = data?.map((item) => ({
        country: item.countryCode,
        value: Number(item?.total),
    }));

    return (
        <Card
            className={`${className}`}
            title={'Stream map'}
            styles={{ body: { padding: 1 } }}
        >
            <div className="flex w-full flex-col items-center justify-center">
                <WorldMap
                    color="#0071ff"
                    value-suffix="people"
                    size="md"
                    data={countData}
                    backgroundColor="transparent"
                />
            </div>
        </Card>
    );
}
