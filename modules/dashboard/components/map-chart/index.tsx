import { Card } from 'antd';
import { useTranslations } from 'next-intl';
import WorldMap from 'react-svg-worldmap';
import { CountryCountData } from '../../types';

type Props = {
    className?: string;
    data: CountryCountData[];
};

const fakeData: CountryCountData[] = [
    { countryCode: 'US', total: 1204500 },
    { countryCode: 'VN', total: 850200 },
    { countryCode: 'BR', total: 640300 },
    { countryCode: 'IN', total: 520100 },
    { countryCode: 'GB', total: 480700 },
    { countryCode: 'DE', total: 420300 },
    { countryCode: 'FR', total: 380200 },
    { countryCode: 'JP', total: 350100 },
    { countryCode: 'RU', total: 290400 },
    { countryCode: 'CA', total: 250300 },
];

export default function MapChart({ data, className }: Props) {
    const displayData = data?.length > 0 ? data : fakeData;
    const countData = displayData?.map((item) => ({
        country: item.countryCode,
        value: Number(item?.total),
    }));
    const messages = useTranslations();

    return (
        <Card className={`${className}`} styles={{ body: { padding: '24px' } }}>
            <h3 className="mb-1 text-lg font-bold text-blue-500">
                {messages('dashboard.stream_by_dsp')}
            </h3>

            <div className="flex w-full flex-col items-center justify-center">
                <WorldMap
                    color="#0071ff"
                    value-suffix="people"
                    size="lg"
                    data={countData}
                    backgroundColor="transparent"
                />
            </div>
        </Card>
    );
}
