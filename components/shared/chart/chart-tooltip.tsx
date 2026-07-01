import { formatCurrency, formattedNumber } from '@/helpers/common';

const TWO_COLUMN_TOOLTIP_GRID_TEMPLATE = 'minmax(100px, 1fr) 96px';
const THREE_COLUMN_TOOLTIP_GRID_TEMPLATE = 'minmax(160px, 1fr) 96px 96px';
const THREE_COLUMN_TOOLTIP_MIN_WIDTH = 320;

interface ChartTooltipBaseProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
    value?: string | number;
}

export interface CustomTooltipProps extends ChartTooltipBaseProps {
    headers?: [string, string];
    formatter?: (value: any) => string;
    showTotal?: boolean;
    totalLabel?: string;
}

export interface ThreeColumnTooltipProps extends ChartTooltipBaseProps {
    headers?: [string, string, string];
    primaryFormatter?: (value: any) => string;
    showTotal?: boolean;
    totalLabel?: string;
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
    formatter,
    showTotal = false,
    totalLabel = 'Total',
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
                <div className="flex min-w-[130px] items-center justify-between gap-3 rounded-lg border border-[#f0f0f0] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex items-center gap-2">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                                backgroundColor: color,
                            }}
                        />
                        <span className="text-[13px] font-medium text-gray-700 dark:text-zinc-300">
                            {displayLabel}
                        </span>
                    </div>
                    <span className="ml-3 text-[13px] font-medium text-gray-900 dark:text-zinc-100">
                        {formatter
                            ? formatter(displayValue)
                            : formattedNumber(displayValue)}
                    </span>
                </div>
            );
        }

        // Nếu có nhiều items (ví dụ: Stacked Bar Chart)
        const sortedPayload = [...payload].sort((a, b) => {
            return (Number(b?.value) || 0) - (Number(a?.value) || 0);
        });
        const totalValue = sortedPayload.reduce((total, item) => {
            return total + (Number(item?.value) || 0);
        }, 0);

        return (
            <div className="flex min-w-[220px] flex-col gap-1.5 rounded-lg border border-[#f0f0f0] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                {label && (
                    <span className="mb-0.5 border-b border-[#f0f0f0] pb-1 text-[13px] font-semibold text-gray-900 dark:border-zinc-700 dark:text-zinc-100">
                        {label}
                    </span>
                )}
                <div
                    className="mb-0.5 grid items-center border-b border-[#f0f0f0] pb-1 gap-x-3 dark:border-zinc-700"
                    style={{
                        gridTemplateColumns: TWO_COLUMN_TOOLTIP_GRID_TEMPLATE,
                    }}
                >
                    <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                        {headers[0]}
                    </span>
                    <span className="whitespace-nowrap text-right text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                        {headers[1]}
                    </span>
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
                            className="grid items-center gap-x-3"
                            style={{
                                gridTemplateColumns:
                                    TWO_COLUMN_TOOLTIP_GRID_TEMPLATE,
                            }}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor: color,
                                    }}
                                />
                                <span className="truncate text-xs text-gray-600 dark:text-zinc-400">
                                    {displayLabel}
                                </span>
                            </div>
                            <span className="whitespace-nowrap text-right text-xs font-medium text-gray-900 dark:text-zinc-100">
                                {formatter
                                    ? formatter(displayValue)
                                    : formattedNumber(displayValue)}
                            </span>
                        </div>
                    );
                })}
                {showTotal && (
                    <div
                        className="mt-0.5 grid items-center border-t border-[#f0f0f0] pt-1.5 gap-x-3 dark:border-zinc-700"
                        style={{
                            gridTemplateColumns:
                                TWO_COLUMN_TOOLTIP_GRID_TEMPLATE,
                        }}
                    >
                        <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                            {totalLabel}
                        </span>
                        <span className="whitespace-nowrap text-right text-xs font-semibold text-gray-900 dark:text-zinc-100">
                            {formatter
                                ? formatter(totalValue)
                                : formattedNumber(totalValue)}
                        </span>
                    </div>
                )}
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
    primaryFormatter,
    showTotal = false,
    totalLabel = 'Total',
    extraColumn,
    minWidth = THREE_COLUMN_TOOLTIP_MIN_WIDTH,
    gridTemplateColumns = THREE_COLUMN_TOOLTIP_GRID_TEMPLATE,
}: ThreeColumnTooltipProps) => {
    if (!active || !payload?.length) return null;

    const sortedPayload = [...payload].sort((a, b) => {
        return (Number(b?.value) || 0) - (Number(a?.value) || 0);
    });
    const totals = sortedPayload.reduce(
        (acc, item) => {
            const itemDataKey = item?.dataKey;
            const itemPayload = item?.payload;
            const extraValue =
                (itemDataKey &&
                    itemPayload?.[`${itemDataKey}${extraColumn.metaKey}`]) ??
                0;

            acc.primary += Number(item?.value) || 0;
            acc.extra += Number(extraValue) || 0;
            return acc;
        },
        { primary: 0, extra: 0 }
    );

    const getTextColorClass = (type?: 'secondary' | 'success' | 'warning' | 'danger') => {
        switch (type) {
            case 'success':
                return 'text-green-600 dark:text-green-400';
            case 'warning':
                return 'text-amber-500 dark:text-amber-400';
            case 'danger':
                return 'text-red-500 dark:text-red-400';
            case 'secondary':
            default:
                return 'text-gray-500 dark:text-zinc-400';
        }
    };

    return (
        <div
            className="flex flex-col gap-2 rounded-lg border border-[#f0f0f0] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800"
            style={{ minWidth }}
        >
            {label && (
                <span className="border-b border-[#f0f0f0] pb-1 text-[13px] font-semibold text-gray-900 dark:border-zinc-700 dark:text-zinc-100">
                    {label}
                </span>
            )}
            <div
                className="grid items-center border-b border-[#f0f0f0] pb-1 gap-x-3 dark:border-zinc-700"
                style={{ gridTemplateColumns }}
            >
                <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    {headers[0]}
                </span>
                <span className="whitespace-nowrap text-right text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    {headers[1]}
                </span>
                <span className="whitespace-nowrap text-right text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    {headers[2]}
                </span>
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
                        className="grid items-center gap-x-3"
                        style={{ gridTemplateColumns }}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <div
                                className="h-2 w-2 flex-shrink-0 rounded-full"
                                style={{
                                    backgroundColor: color,
                                }}
                            />
                            <span className="truncate text-xs text-gray-600 dark:text-zinc-400">
                                {displayLabel}
                            </span>
                        </div>
                        <span className="whitespace-nowrap text-right text-xs font-medium text-gray-900 dark:text-zinc-100">
                            {primaryFormatter
                                ? primaryFormatter(displayValue)
                                : formattedNumber(displayValue)}
                        </span>
                        <span
                            className={`whitespace-nowrap text-right text-xs ${getTextColorClass(
                                extraColumn.textType
                            )}`}
                        >
                            {extraColumn.formatter
                                ? extraColumn.formatter(extraValue)
                                : formattedNumber(extraValue as any)}
                        </span>
                    </div>
                );
            })}
            {showTotal && (
                <div
                    className="grid items-center border-t border-[#f0f0f0] pt-1.5 gap-x-3 dark:border-zinc-700"
                    style={{ gridTemplateColumns }}
                >
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        {totalLabel}
                    </span>
                    <span className="whitespace-nowrap text-right text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        {primaryFormatter
                            ? primaryFormatter(totals.primary)
                            : formattedNumber(totals.primary)}
                    </span>
                    <span
                        className={`whitespace-nowrap text-right text-xs font-semibold ${getTextColorClass(
                            extraColumn.textType
                        )}`}
                    >
                        {extraColumn.formatter
                            ? extraColumn.formatter(totals.extra)
                            : formattedNumber(totals.extra as any)}
                    </span>
                </div>
            )}
        </div>
    );
};

export const SalesTooltip = (
    props: ChartTooltipBaseProps & {
        showTotal?: boolean;
        totalLabel?: string;
    }
) => {
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
