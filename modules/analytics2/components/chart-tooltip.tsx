'use client';

import { formattedNumber } from '@/helpers/common';

export interface TooltipPayloadItem {
    name: string;
    value: number;
    color: string;
}

export interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    totalLabel: string;
    totalKey?: string;
}

export function ChartTooltip({
    active,
    payload,
    label,
    totalLabel,
    totalKey = 'total',
}: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;

    const items = payload.filter((p) => p.name !== totalKey);
    const totalEntry = payload.find((p) => p.name === totalKey);

    return (
        <div className="min-w-[180px] rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-2 text-[13px] font-semibold text-gray-700 dark:text-zinc-200">
                {label}
            </div>
            {items.map((item) => (
                <div
                    key={item.name}
                    className="mb-1 flex items-center justify-between gap-6 text-xs text-gray-500 dark:text-zinc-400"
                >
                    <span className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-2.5 w-2.5 rounded-sm"
                            style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-zinc-100">
                        {formattedNumber(item.value, undefined as any, true)}
                    </span>
                </div>
            ))}
            {totalEntry && (
                <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-xs font-semibold text-gray-700 dark:border-zinc-700 dark:text-zinc-200">
                    <span>{totalLabel}</span>
                    <span>{formattedNumber(totalEntry.value, undefined as any, true)}</span>
                </div>
            )}
        </div>
    );
}
