import { Bar, ResponsiveContainer } from 'recharts';

import { Tooltip as AntdTooltip, Empty, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import { TopUserData } from '../../types/user-statistic';

type Props = {
    data: TopUserData[];
    tooltipText: string;
    secondTooltipText?: string;
    onBarClick?: (payload: TopUserData) => void;
};

export default function CustomBarChart({
    tooltipText,
    secondTooltipText,
    data,
    onBarClick,
}: Props) {
    const messages = useTranslations();
    const renderTooltip: ContentType<number, string> = ({ payload, label }) => {
        return (
            <Space direction="vertical">
                <div className="rounded-lg border bg-white p-2">
                    <p>
                        <span>{label}</span>:
                        <span>
                            {payload?.[0]?.value} {tooltipText}
                        </span>
                    </p>
                </div>
                {secondTooltipText && (
                    <div className="rounded-lg border bg-white p-2">
                        <p>
                            <span>{secondTooltipText}</span>
                        </p>
                    </div>
                )}
            </Space>
        );
    };

    const dataConverted = data.map((item) => ({
        ...item,
        count: Number(item.count),
    }));
    const dataSort = dataConverted.sort((a, b) => {
        return b.count - a.count;
    });

    if (data.length === 0) {
        return <Empty />;
    }

    const renderCustomYAxisTick = (props: any) => {
        const { x, y, payload } = props;
        const fullName = payload.value;
        // Giới hạn độ dài tên hiển thị
        const truncatedName =
            fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName;

        return (
            <AntdTooltip title={fullName} placement="left">
                <g transform={`translate(${x},${y})`}>
                    <text
                        x={-125}
                        y={0}
                        dy={3}
                        textAnchor="start"
                        fill="#666"
                        className="cursor-default"
                    >
                        {truncatedName}
                    </text>
                </g>
            </AntdTooltip>
        );
    };

    return (
        <ResponsiveContainer width="95%" height={250}>
            <BarChart
                data={dataSort}
                layout="vertical"
                onClick={(data) => {
                    const payload = data?.activePayload?.[0]?.payload;
                    onBarClick?.(payload);
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    horizontal={false}
                />
                <XAxis
                    dataKey="count"
                    type="number"
                    axisLine={{ stroke: '#aaa', strokeWidth: 1 }}
                    tickLine={{ stroke: '#aaa', strokeWidth: 1 }}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    tick={renderCustomYAxisTick}
                    width={180}
                    tickMargin={20}
                    axisLine={{ stroke: '#aaa', strokeWidth: 1 }}
                    tickLine={false}
                    orientation="left"
                />
                <Tooltip content={renderTooltip} />
                <Bar
                    dataKey="count"
                    fill="#608fc9"
                    barSize={20}
                    label={{ position: 'insideRight', fill: 'white' }}
                    className="cursor-pointer"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
