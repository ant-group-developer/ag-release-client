import { formattedNumber } from '@/helpers/common';
import { Typography } from 'antd';

export const ChartLegendItem = ({
    label,
    value,
    width = '120px',
}: {
    label: string | number;
    value: string | number;
    width?: string;
}) => {
    return (
        <div
            style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                width: width,
                marginLeft: '10px',
                whiteSpace: 'nowrap',
            }}
        >
            <Typography.Text>{label}</Typography.Text>
            <Typography.Text style={{ color: '#8c8c8c' }}>
                {formattedNumber(value)}
            </Typography.Text>
        </div>
    );
};

export const CustomizedPieLabel = (props: any, content?: string | number) => {
    const {
        cx = 0,
        cy = 0,
        midAngle = 0,
        innerRadius = 0,
        outerRadius = 0,
        percent = 0,
    } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontWeight: 'bold',
                fontSize: '12px',
                pointerEvents: 'none',
            }}
        >
            {content !== undefined ? content : `${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
