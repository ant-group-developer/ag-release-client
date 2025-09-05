import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useTranslations } from 'next-intl';
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
    const messages = useTranslations();
    const gradientId = `stream-gradient-${Math.random()}`;
    const data = [
        { date: '2024-01-01', value: 1200 },
        { date: '2024-01-02', value: 1300 },
        { date: '2024-01-03', value: 1150 },
        { date: '2024-01-04', value: 1450 },
        { date: '2024-01-05', value: 1600 },
        { date: '2024-01-06', value: 1500 },
        { date: '2024-01-07', value: 1700 },
        { date: '2024-01-08', value: 1850 },
        { date: '2024-01-09', value: 1750 },
        { date: '2024-01-10', value: 1650 },
        { date: '2024-01-11', value: 1800 },
        { date: '2024-01-12', value: 2000 },
        { date: '2024-01-13', value: 2100 },
        { date: '2024-01-14', value: 1900 },
        { date: '2024-01-15', value: 1850 },
        { date: '2024-01-16', value: 2200 },
        { date: '2024-01-17', value: 2050 },
        { date: '2024-01-18', value: 1950 },
        { date: '2024-01-19', value: 1750 },
        { date: '2024-01-20', value: 1600 },
        { date: '2024-01-21', value: 1700 },
        { date: '2024-01-22', value: 1650 },
        { date: '2024-01-23', value: 1800 },
        { date: '2024-01-24', value: 1900 },
        { date: '2024-01-25', value: 2100 },
        { date: '2024-01-26', value: 2000 },
        { date: '2024-01-27', value: 2200 },
        { date: '2024-01-28', value: 2300 },
        { date: '2024-01-29', value: 2150 },
        { date: '2024-01-30', value: 2400 },
        { date: '2024-01-31', value: 2550 },
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
                            tickFormatter={(date) =>
                                formattedDate(date, DATE_FORMAT.DATE_ONLY)
                            }
                            minTickGap={40}
                        />

                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded border bg-white p-2 shadow-lg">
                                            <p className="text-sm">
                                                {formattedDate(
                                                    payload[0].payload.date,
                                                    DATE_FORMAT.DATE_ONLY
                                                )}
                                                :{' '}
                                                {payload[0].payload.value}{' '}
                                            </p>
                                        </div>
                                    );
                                }
                            }}
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
