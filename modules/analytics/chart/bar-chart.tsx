import { BAR_COLOR } from '@/constants/color';
import { formattedNumber } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import {
    Bar,
    BarChart,
    LabelList,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    data:
        | {
              value: number;
              name: string;
              color?: string;
          }[]
        | any[];
    maxLengthName?: number;
};

export default function BarChartAnalytics({ data, maxLengthName = 10 }: Props) {
    const isLessThanNumberItems = data?.length && data?.length < 5;
    const messages = useTranslations();

    const formatUserName = (name: string, maxLength: number = 10) => {
        return name.length > maxLength
            ? `${name.substring(0, maxLength)}...`
            : name;
    };
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const fullName = payload[0]?.payload?.user?.name || label;

            return (
                <div className="rounded border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="mb-2 font-medium">{fullName}</p>
                    {payload.map((entry: any, index: number) => {
                        const roundValue = Math.round(entry.value);
                        return (
                            <p key={index} className="text-sm">
                                {entry.name}: {formattedNumber(roundValue)}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };
    return (
        <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} margin={{ top: 20 }} barSize={30}>
                <XAxis
                    dataKey="name"
                    // axisLine={false}
                    tickLine={false}
                    interval={0} // luôn hiển thị đủ label
                    tickFormatter={(v) => formatUserName(v, maxLengthName)}
                    angle={isLessThanNumberItems ? 0 : -60}
                    textAnchor={isLessThanNumberItems ? 'middle' : 'end'} // neo chữ về cuối để không đè lên bar
                    height={90} // tăng chiều cao để chữ không bị cắt
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar
                    dataKey="value"
                    fill={BAR_COLOR}
                    name={messages('common.total')}
                    radius={[6, 6, 0, 0]}
                >
                    <LabelList
                        dataKey="value"
                        position="top"
                        fontSize={13}
                        formatter={(v: any) => {
                            const round = Math.round(v);
                            return formattedNumber(round);
                        }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
