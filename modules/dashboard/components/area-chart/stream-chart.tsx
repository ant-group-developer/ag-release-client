import {
    Area,
    AreaChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    data?: { name: string; value: number }[];
    color?: string;
};

export default function StreamChart({ color = '#90D5FF' }: Props) {
    const gradientId = `stream-gradient-${Math.random()}`;
    const data = [
        { date: '01-01-2024', value: 1200 },
        { date: '02-01-2024', value: 1350 },
        { date: '03-01-2024', value: 1100 },
        { date: '04-01-2024', value: 1500 },
        { date: '05-01-2024', value: 1600 },
        { date: '06-01-2024', value: 1700 },
        { date: '07-01-2024', value: 1550 },
        { date: '08-01-2024', value: 1800 },
        { date: '09-01-2024', value: 1900 },
        { date: '10-01-2024', value: 1750 },
        { date: '11-01-2024', value: 1650 },
        { date: '12-01-2024', value: 2000 },
        { date: '13-01-2024', value: 2100 },
        { date: '14-01-2024', value: 1950 },
        { date: '15-01-2024', value: 1850 },
        { date: '16-01-2024', value: 2200 },
        { date: '17-01-2024', value: 2050 },
        { date: '18-01-2024', value: 1900 },
        { date: '19-01-2024', value: 1750 },
        { date: '20-01-2024', value: 1600 },
        { date: '21-01-2024', value: 1550 },
        { date: '22-01-2024', value: 1650 },
        { date: '23-01-2024', value: 1700 },
        { date: '24-01-2024', value: 1800 },
        { date: '25-01-2024', value: 2000 },
        { date: '26-01-2024', value: 2100 },
        { date: '27-01-2024', value: 2200 },
        { date: '28-01-2024', value: 2300 },
        { date: '29-01-2024', value: 2400 },
        { date: '30-01-2024', value: 2500 },
        { date: '31-01-2024', value: 2600 },
    ];
    return (
        <div className="flex flex-col justify-between rounded-lg border">
            <p className="px-6 py-4 pb-4 text-left text-base font-bold">
                Stream
            </p>

            <div className="h-[450px] px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={color}
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={color}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            formatter={(value: number) => [
                                `${value}`,
                                'Lượt phát',
                            ]}
                            labelFormatter={(label) => `Ngày: ${label}`}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="none"
                            fill={`url(#${gradientId})`}
                            fillOpacity={1}
                            tooltipType="none"
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
