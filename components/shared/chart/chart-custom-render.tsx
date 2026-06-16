import { formattedNumber } from '@/helpers/common';
import { Typography } from 'antd';

export const ChartLegendItem = ({
    label,
    value,
    width = '140px',
}: {
    label: string | number;
    value: string | number;
    width?: string;
}) => {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'space-between',
                width: width,
                marginLeft: '10px',
                maxWidth: '100%',
            }}
        >
            <Typography.Text
                style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
                title={String(label)}
            >
                {label}
            </Typography.Text>
            <Typography.Text
                style={{
                    color: '#8c8c8c',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                }}
            >
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

    // Ẩn nhãn nếu phần trăm quá nhỏ (dưới 5%) để tránh chồng lấp gây xấu giao diện
    if (percent < 0.05) {
        return null;
    }

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
                // fontWeight: 'bold',
                fontSize: '12px',
                pointerEvents: 'none',
            }}
        >
            {content !== undefined ? content : `${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
