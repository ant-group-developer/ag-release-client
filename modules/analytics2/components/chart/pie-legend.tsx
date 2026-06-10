'use client';

import { formattedNumber } from '@/helpers/common';

interface PieLegendItem {
    name: string;
    value: number;
    color: string;
}

interface Props {
    data: PieLegendItem[];
}

export default function PieLegend({ data }: Props) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
        <div className="flex flex-col gap-2.5 pl-4">
            {data.map((item) => (
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
                </div>
            ))}
        </div>
    );
}
