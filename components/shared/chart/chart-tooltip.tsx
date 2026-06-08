import { formatCurrency, formattedNumber } from '@/helpers/common';
import { Typography } from 'antd';

interface ChartTooltipBaseProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
    value?: string | number;
}

export interface CustomTooltipProps extends ChartTooltipBaseProps {
    headers?: [string, string];
}

interface ThreeColumnTooltipProps extends ChartTooltipBaseProps {
    headers?: [string, string, string];
    extraColumn: {
        metaKey: string;
        formatter?: (value: unknown) => string;
        textType?: 'secondary' | 'success' | 'warning' | 'danger';
    };
    minWidth?: number;
    gridTemplateColumns?: string;
}

export const CustomTooltip = ({
    active,
    payload,
    label,
    value,
    headers = ['Name', 'Value'],
}: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        // Nếu chỉ có 1 item (ví dụ: Pie Chart)
        if (payload.length === 1) {
            const item = payload[0];
            const itemDataKey = item?.dataKey;
            const itemPayload = item?.payload;
            const displayLabel =
                (itemDataKey && itemPayload?.[`${itemDataKey}Name`]) ??
                label ??
                item?.name ??
                '';
            const displayValue = value ?? item?.value ?? '';
            const color =
                (itemDataKey && itemPayload?.[`${itemDataKey}Color`]) ??
                item?.color ??
                '#1890ff';

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

        // Nếu có nhiều items (ví dụ: Stacked Bar Chart)
        const sortedPayload = [...payload].sort((a, b) => {
            return (Number(b?.value) || 0) - (Number(a?.value) || 0);
        });

        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    minWidth: '220px',
                }}
            >
                {label && (
                    <Typography.Text
                        style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            borderBottom: '1px solid #f0f0f0',
                            paddingBottom: '4px',
                            marginBottom: '2px',
                        }}
                    >
                        {label}
                    </Typography.Text>
                )}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(100px, 1fr) 70px',
                        alignItems: 'center',
                        columnGap: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: '4px',
                        marginBottom: '2px',
                    }}
                >
                    <Typography.Text
                        type="secondary"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                    >
                        {headers[0]}
                    </Typography.Text>
                    <Typography.Text
                        type="secondary"
                        style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            textAlign: 'right',
                        }}
                    >
                        {headers[1]}
                    </Typography.Text>
                </div>
                {sortedPayload.map((item, idx) => {
                    const itemDataKey = item?.dataKey;
                    const itemPayload = item?.payload;
                    const displayLabel =
                        (itemDataKey && itemPayload?.[`${itemDataKey}Name`]) ??
                        item?.name ??
                        '';
                    const displayValue = item?.value ?? '';
                    const color =
                        (itemDataKey && itemPayload?.[`${itemDataKey}Color`]) ??
                        item?.color ??
                        '#1890ff';
                    return (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(100px, 1fr) 70px',
                                alignItems: 'center',
                                columnGap: '12px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                    }}
                                />
                                <Typography.Text
                                    ellipsis
                                    style={{ fontSize: '12px', minWidth: 0 }}
                                >
                                    {displayLabel}
                                </Typography.Text>
                            </div>
                            <Typography.Text
                                style={{
                                    fontWeight: 500,
                                    fontSize: '12px',
                                    textAlign: 'right',
                                }}
                            >
                                {formattedNumber(displayValue)}
                            </Typography.Text>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

export const ThreeColumnTooltip = ({
    active,
    payload,
    label,
    headers = ['Name', 'Value', 'Extra'],
    extraColumn,
    minWidth = 280,
    gridTemplateColumns = 'minmax(100px, 1fr) 70px 90px',
}: ThreeColumnTooltipProps) => {
    if (!active || !payload?.length) return null;

    const sortedPayload = [...payload].sort((a, b) => {
        return (Number(b?.value) || 0) - (Number(a?.value) || 0);
    });

    return (
        <div
            style={{
                backgroundColor: '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth,
            }}
        >
            {label && (
                <Typography.Text
                    style={{
                        fontWeight: 600,
                        fontSize: '13px',
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: '4px',
                    }}
                >
                    {label}
                </Typography.Text>
            )}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns,
                    alignItems: 'center',
                    columnGap: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '4px',
                    marginBottom: '2px',
                }}
            >
                <Typography.Text
                    type="secondary"
                    style={{ fontSize: '11px', fontWeight: 500 }}
                >
                    {headers[0]}
                </Typography.Text>
                <Typography.Text
                    type="secondary"
                    style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        textAlign: 'right',
                    }}
                >
                    {headers[1]}
                </Typography.Text>
                <Typography.Text
                    type="secondary"
                    style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        textAlign: 'right',
                    }}
                >
                    {headers[2]}
                </Typography.Text>
            </div>
            {sortedPayload.map((item, idx) => {
                const itemDataKey = item?.dataKey;
                const itemPayload = item?.payload;
                const displayLabel =
                    (itemDataKey && itemPayload?.[`${itemDataKey}Name`]) ??
                    item?.name ??
                    '';
                const displayValue = item?.value ?? '';
                const extraValue =
                    (itemDataKey &&
                        itemPayload?.[
                            `${itemDataKey}${extraColumn.metaKey}`
                        ]) ??
                    0;
                const color =
                    (itemDataKey && itemPayload?.[`${itemDataKey}Color`]) ??
                    item?.color ??
                    '#1890ff';

                return (
                    <div
                        key={idx}
                        style={{
                            display: 'grid',
                            gridTemplateColumns,
                            alignItems: 'center',
                            columnGap: '12px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    flex: '0 0 auto',
                                }}
                            />
                            <Typography.Text
                                ellipsis
                                style={{ fontSize: '12px', minWidth: 0 }}
                            >
                                {displayLabel}
                            </Typography.Text>
                        </div>
                        <Typography.Text
                            style={{
                                fontWeight: 500,
                                fontSize: '12px',
                                textAlign: 'right',
                            }}
                        >
                            {formattedNumber(displayValue)}
                        </Typography.Text>
                        <Typography.Text
                            type={extraColumn.textType ?? 'secondary'}
                            style={{ fontSize: '12px', textAlign: 'right' }}
                        >
                            {extraColumn.formatter
                                ? extraColumn.formatter(extraValue)
                                : formattedNumber(extraValue as any)}
                        </Typography.Text>
                    </div>
                );
            })}
        </div>
    );
};

export const SalesTooltip = (props: ChartTooltipBaseProps) => {
    return (
        <ThreeColumnTooltip
            {...props}
            headers={['DSP', 'View', 'Revenue']}
            extraColumn={{
                metaKey: 'RevenueUsd',
                formatter: (value) => formatCurrency(Number(value) || 0, 'USD'),
            }}
        />
    );
};
