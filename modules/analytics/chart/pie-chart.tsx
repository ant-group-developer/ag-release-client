import { COLORS } from '@/constants/color';
import { formattedNumber } from '@/helpers/common';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
type Props = {
    data:
        | {
              value: number;
              name: string;
              color?: string;
          }[]
        | any[];
};

export default function PieChartAnalytics({ data }: Props) {
    return (
        <ResponsiveContainer height="100%" width="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="35%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={entry.color ?? COLORS[index % COLORS.length]}
                            stroke="none"
                        />
                    ))}
                </Pie>

                <Tooltip
                    formatter={(value: number, name: string) => {
                        const total = data.reduce(
                            (acc, cur) => acc + cur.value,
                            0
                        );
                        const percent = ((value / total) * 100).toFixed(2);
                        return [
                            `${formattedNumber(value)} (${percent}%)`,
                            name,
                        ];
                    }}
                    contentStyle={{
                        borderRadius: 8,
                        border: '1px solid #eee',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }}
                />

                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    wrapperStyle={{ transform: 'translateX(-40px)' }}
                    content={({ payload }) => {
                        if (!payload?.length) return null;

                        const total = payload.reduce(
                            (acc: number, cur: any) =>
                                acc + (cur?.payload?.value || 0),
                            0
                        );

                        return (
                            <ul className="flex flex-col gap-2">
                                {payload.map((entry: any, index: number) => {
                                    const value = entry?.payload?.value || 0;
                                    const name = entry?.payload?.name ?? 'N/A';
                                    const percent = total
                                        ? ((value / total) * 100).toFixed(2)
                                        : '0.00';

                                    return (
                                        <li
                                            key={index}
                                            className="flex justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-1">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            entry.color,
                                                    }}
                                                ></div>
                                                <span className="text-gray-800">
                                                    {name}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {/* <span>
                                                                {formattedNumber(
                                                                    value
                                                                )}
                                                            </span> */}
                                                <span className="font-semibold">
                                                    {percent}%
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
