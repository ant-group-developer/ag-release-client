import { formattedNumber } from '@/helpers/common';
import { Card, theme } from 'antd';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    color?: string;
    className?: string;
};

export default function StreamChart({ color = '#90D5FF', className }: Props) {
    // const messages = useTranslations();
    const { token } = theme.useToken();

    // 🔹 Fake data: các DSP phổ biến
    const data = [
        { name: 'Spotify', value: 52000 },
        { name: 'Apple Music', value: 31000 },
        { name: 'YouTube Music', value: 46000 },
        { name: 'Amazon Music', value: 22000 },
        { name: 'Deezer', value: 15000 },
        { name: 'Tidal', value: 12000 },
        { name: 'SoundCloud', value: 8000 },
        { name: 'Tencent Music', value: 27000 },
        { name: 'NetEase', value: 19000 },
        { name: 'Anghami', value: 6000 },
    ];

    return (
        <Card
            className="flex h-full flex-col justify-between bg-white"
            title={'Stream by DSP'}
            styles={{ body: { padding: 0, height: '100%' } }}
        >
            <div className={`h-full px-4 pb-4 ${className}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const { name, value } = payload[0].payload;
                                    return (
                                        <div
                                            className="rounded border px-3 py-2 shadow-md"
                                            style={{
                                                backgroundColor:
                                                    token.colorBgContainer,
                                            }}
                                        >
                                            <p className="text-sm font-semibold">
                                                {name}
                                            </p>
                                            <p className="text-sm">
                                                Streams:{' '}
                                                <span className="font-semibold">
                                                    {formattedNumber(value)}
                                                </span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill={'#2e95e4'}
                            radius={[6, 6, 0, 0]}
                        >
                            <LabelList dataKey="value" position="top" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
