import { BAR_COLOR, COLORS } from '@/constants/color';
import { formattedNumber } from '@/helpers/common';
import { Card, Segmented } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AppTable from '../table/normal-table';

type DefaultChart = 'bar' | 'pie' | 'list';

type Props = {
    title: string;
    className?: string;
    defaultChart?: DefaultChart;
    height?: number;
    maxLengthName?: number;
    data:
        | {
              value: number;
              name: string;
              color?: string;
          }[]
        | any[];
};

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" fontSize={13}>
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const fullName = payload[0]?.payload?.user?.name || label;
        return (
            <div className="rounded border border-gray-200 bg-white p-3 shadow-lg">
                <p className="mb-2 font-medium">{fullName}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm">
                        {entry.name}: {formattedNumber(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const formatUserName = (name: string, maxLength: number = 10) => {
    return name.length > maxLength
        ? `${name.substring(0, maxLength)}...`
        : name;
};

export default function ChartSwitcher({
    title,
    className,
    defaultChart = 'pie',
    maxLengthName = 10,
    data = [],
}: Props) {
    const [typeChart, setTypeChart] = useState<DefaultChart>(defaultChart);
    const isLessThanNumberItems = data?.length && data?.length < 5;
    const messages = useTranslations();

    const renderChart = () => {
        switch (typeChart) {
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 20 }} barSize={30}>
                        <XAxis
                            dataKey="name"
                            // axisLine={false}
                            tickLine={false}
                            interval={0} // luôn hiển thị đủ label
                            tickFormatter={(v) =>
                                formatUserName(v, maxLengthName)
                            }
                            angle={isLessThanNumberItems ? 0 : -60}
                            textAnchor={
                                isLessThanNumberItems ? 'middle' : 'end'
                            } // neo chữ về cuối để không đè lên bar
                            height={90} // tăng chiều cao để chữ không bị cắt
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        <Bar
                            dataKey="value"
                            fill={BAR_COLOR}
                            name={messages('common.quantity')}
                            radius={[6, 6, 0, 0]}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                fontSize={13}
                                formatter={(v: any) => formattedNumber(v)}
                            />
                        </Bar>
                    </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={60}
                            dataKey="value"
                        >
                            {data?.map((entry, index) => {
                                const name = entry?.name;
                                return (
                                    <Cell
                                        key={index}
                                        name={`${name}`}
                                        fill={
                                            entry?.color ??
                                            COLORS[index % COLORS.length]
                                        }
                                    />
                                );
                            })}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `${formattedNumber(value)}`,
                                name,
                            ]}
                            contentStyle={{ borderRadius: 8 }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                );

            case 'list':
                const columns: ColumnType<any>[] = [
                    {
                        title: messages('common.iNo'),
                        key: 'iNo',
                        width: 50,
                        align: 'center',
                        render: (_, __, i) => (i = i + 1),
                    },
                    {
                        title: `${messages('common.name')}`,
                        key: 'name',
                        dataIndex: 'name',
                        ellipsis: true,
                        align: 'left',
                        width: 500,
                        render: (_, record) => {
                            return <div>{record?.name}</div>;
                        },
                    },
                    {
                        title: `${messages('common.quantity')}`,
                        key: 'quantity',
                        dataIndex: 'quantity',
                        align: 'center',
                        render: (_, record) => {
                            return <div>{record?.value}</div>;
                        },
                    },
                ];
                return (
                    <div className="">
                        <AppTable
                            dataSource={data}
                            columns={columns}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                );
            default:
                return <></>;
        }
    };

    return (
        <Card
            title={title}
            className={className}
            bodyStyle={{
                height: '90%',
                overflowY: 'auto',
                padding: '8px 24px',
            }}
            extra={
                <Segmented
                    value={typeChart}
                    onChange={(val) => setTypeChart(val as DefaultChart)}
                    options={[
                        {
                            label: messages('common.list'),
                            value: 'list',
                        },
                        {
                            label: messages('common.barChart'),
                            value: 'bar',
                        },
                        {
                            label: messages('common.pieChart'),
                            value: 'pie',
                        },
                    ]}
                />
            }
        >
            <ResponsiveContainer key={typeChart} height="100%" width="100%">
                {renderChart()}
            </ResponsiveContainer>
        </Card>
    );
}
