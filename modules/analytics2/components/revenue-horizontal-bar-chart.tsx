'use client';

import { Card, Empty, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
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

interface Props {
    title: string;
    data: any[];
    labelKey: string;
    valueKey: string;
    isLoading: boolean;
}

export function formatAbbreviatedNumber(num: number): string {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2).replace(/\.00$/, '')}K`;
    }
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

const truncateText = (text: string, maxLength: number = 22) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function RevenueHorizontalBarChart({
    title,
    data,
    labelKey,
    valueKey,
    isLoading,
}: Props) {
    const messages = useTranslations();

    const formatAxisValue = (v: any) => {
        if (v === 0) return '0K';
        return formatAbbreviatedNumber(v);
    };

    return (
        <Card
            className="rounded-xl border-none shadow-sm flex-1"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 text-center">
                <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-gray-800 dark:text-zinc-200">
                    {title}
                </span>
            </div>

            {isLoading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : data.length === 0 ? (
                <Empty className="py-12" description={messages('common.noDataAvailable')} />
            ) : (
                <div className="w-full">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 45,
                                    left: -10,
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
                                    tickFormatter={formatAxisValue}
                                />
                                <YAxis
                                    type="category"
                                    dataKey={labelKey}
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
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any) => [
                                        `$${Number(value).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`,
                                        messages('analytics.revenue.label', { defaultValue: 'Revenue' }),
                                    ]}
                                />
                                <Bar
                                    dataKey={valueKey}
                                    fill="#1677ff"
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                >
                                    <LabelList
                                        dataKey={valueKey}
                                        position="right"
                                        formatter={(v: any) =>
                                            formatAbbreviatedNumber(Number(v))
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
            )}
        </Card>
    );
}
