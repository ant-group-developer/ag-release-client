import { formattedNumber } from '@/helpers/common';
import { Typography } from 'antd';

export interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
    value?: string | number;
}

export const CustomTooltip = ({
    active,
    payload,
    label,
    value,
}: CustomTooltipProps) => {
    if (active) {
        const item = payload && payload.length ? payload[0] : null;

        // Ưu tiên truyền từ props ngoài vào, nếu không thì lấy từ payload của recharts
        const displayLabel = label ?? item?.name ?? '';
        const displayValue = value ?? item?.value ?? '';
        const color = item?.color ?? '#1890ff';

        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: '130px',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <div
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: color,
                        }}
                    />
                    <Typography.Text>{displayLabel}</Typography.Text>
                </div>
                <Typography.Text
                    style={{ marginLeft: '12px', fontWeight: 500 }}
                >
                    {formattedNumber(displayValue)}
                </Typography.Text>
            </div>
        );
    }
    return null;
};
