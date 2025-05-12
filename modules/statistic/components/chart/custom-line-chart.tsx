import { cn } from '@/helpers/common';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import { ProductGraphData } from '../../types/product-statistic';

type Props = {
    className?: string;
    data: ProductGraphData[];
    text: string;
};

export default function CustomLineChart({ data, className, text }: Props) {
    const renderTooltip: ContentType<number, string> = ({ payload, label }) => {
        return (
            <div className="rounded-lg border bg-white p-2">
                <p>
                    <span>{label}</span>:
                    <span>
                        {payload?.[0]?.value} {text}
                    </span>
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
                    <YAxis dataKey="value" axisLine={false} tickLine={false} />
                    <Tooltip content={renderTooltip} />
                    <Line
                        type="linear"
                        dataKey="value"
                        stroke="#608fc9"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
