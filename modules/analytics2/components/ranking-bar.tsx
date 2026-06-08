'use client';

import { CustomTooltip } from '@/components/shared/chart/chart-tooltip';
import { formattedNumber } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
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

const truncateText = (text: string, maxLength: number = 22) => {
    if (!text) return '';
    return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
};

interface RankingBarProps<T> {
    data: T[];
    labelKey: keyof T;
    valueKey: keyof T;
}

export default function RankingBar<T>({
    data,
    labelKey,
    valueKey,
}: RankingBarProps<T>) {
    const messages = useTranslations();

    const chartData = useMemo(() => {
        return data || [];
    }, [data]);

    return (
        <div className="w-full">
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            top: 10,
                            right: 45,
                            left: -5,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            vertical={true}
                            stroke="#f0f0f0"
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: '#999',
                            }}
                            tickFormatter={(v) =>
                                formattedNumber(v, undefined, true)
                            }
                        />
                        <YAxis
                            type="category"
                            dataKey={labelKey as string}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: '#666',
                            }}
                            tickFormatter={(v) => truncateText(v, 22)}
                            width={120}
                            interval={0}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            animationEasing="ease"
                        />
                        <Bar
                            dataKey={valueKey as string}
                            fill="#1677ff"
                            radius={[0, 4, 4, 0]}
                            barSize={18}
                        >
                            <LabelList
                                dataKey={valueKey as string}
                                position="right"
                                formatter={(v: any) =>
                                    formattedNumber(v, undefined, true)
                                }
                                style={{
                                    fontSize: 10,
                                    fill: '#666',
                                    fontWeight: 600,
                                }}
                                offset={8}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
