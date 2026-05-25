'use client';

import { formattedNumber } from '@/helpers/common';
import { PIE_CHART_DATA } from '../constants/mock-data';

export default function PieLegend() {
    const total = PIE_CHART_DATA.reduce((sum, d) => sum + d.value, 0);
    return (
        <div className="flex flex-col gap-2.5 pl-4">
            {PIE_CHART_DATA.map((item) => (
                <div
                    key={item.name}
                    className="flex items-center justify-between gap-4 text-sm"
                >
                    <div className="flex items-center gap-2 text-nowrap">
                        <div
                            className="h-3 w-3 flex-shrink-0 rounded-sm"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-600 dark:text-zinc-400">
                            {item.name}
                        </span>
                    </div>
                    {/* <div className="flex items-center gap-3 text-nowrap">
                        <span className="font-semibold">
                            {formattedNumber(item.value, undefined as any, true)}
                        </span>
                        <span className="w-12 text-right text-gray-400">
                            {((item.value / total) * 100).toFixed(1)}%
                        </span>
                    </div> */}
                </div>
            ))}
        </div>
    );
}
