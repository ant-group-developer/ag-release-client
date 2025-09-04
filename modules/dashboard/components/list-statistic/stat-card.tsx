import { Area, AreaChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

type StatCardProps = {
    title: string;
    value: string;
    trend: number;
    chartClass?: string;
    color?: string; // màu chính cho chart
    data: { name: string; value: number }[];
};

export default function StatCard({
    title,
    value,
    trend,
    color,
    data,
}: StatCardProps) {
    // Xác định loại trend
    const trendType = trend >= 0 ? 'increase' : 'decrease';

    let trendText: string;

    if (trend > 0) {
        trendText = 'Increased last month';
    } else if (trend < 0) {
        trendText = 'Decreased last month';
    } else {
        trendText = 'No change';
    }

    const chartColor =
        color || (trendType === 'increase' ? '#22c55e' : '#ef4444');

    const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

    return (
        <div className="rounded-lg border p-4">
            <div className="flex gap-x-16">
                <div>
                    <h4 className="text-sm text-gray-500">{title}</h4>
                    <p className="text-2xl font-bold">{value}</p>
                </div>

                {/* Chart */}
                <div className="h-16 w-28 flex-1">
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
                                        stopColor={chartColor}
                                        stopOpacity={0.1}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={chartColor}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <Tooltip
                                formatter={(value: number) => [
                                    `${value}`,
                                    'Lượt phát',
                                ]}
                                labelFormatter={(label) => {
                                    console.log('🚀 ~ label:', label);
                                    return `Ngày: ${label}`;
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
                                stroke={chartColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span
                    className={
                        trendType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                    }
                >
                    {trendType === 'increase' ? '▲' : '▼'} {trend.toFixed(2)}%
                </span>
                <span className="text-gray-500">{trendText}</span>
            </div>
        </div>
    );
}
