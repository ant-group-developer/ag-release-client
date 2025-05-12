import { cn } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import { OrderProductDualLineChartData } from '../../types';

type Props = {
    data: OrderProductDualLineChartData[];
    className?: string;
};

export default function OrderProductDualLineChart({ data, className }: Props) {
    const messages = useTranslations();
    const renderTooltip: ContentType<number, string> = ({ payload, label }) => {
        return (
            <div className="rounded-lg border bg-white p-2">
                <p>
                    <span>{label}</span>:
                    {payload?.map((entry) => (
                        <div
                            key={entry.dataKey}
                            className="flex justify-between"
                        >
                            <span>{entry.name}:</span>
                            <span>{entry.value}</span>
                        </div>
                    ))}
                </p>
            </div>
        );
    };
    return (
        <div className={cn('h-[250px] w-full pr-4', className)}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={40}
                        interval={'preserveStartEnd'}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip shared={false} content={renderTooltip} />
                    <Legend />
                    <Line
                        name={messages('order.title')}
                        type="monotone"
                        dataKey="order"
                        stroke="#608fc9"
                        dot={false}
                    />
                    <Line
                        name={messages('product.label')}
                        type="monotone"
                        dataKey="product"
                        stroke="#82ca9d"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
