'use client';

import { formattedNumber } from '@/helpers/common';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { renderCustomLabel } from './custom-label';
import PieLegend from './pie-legend';

interface PieViewProps {
    pieData: any[];
}

export default function PieView({ pieData }: PieViewProps) {
    return (
        <div className="flex h-[400px] w-full items-center">
            <div className="h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={160}
                            stroke="none"
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomLabel}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            formatter={(value: any) => [
                                formattedNumber(value, undefined as any, true),
                                'Streams',
                            ]}
                            animationEasing="ease"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-56 flex-shrink-0">
                <PieLegend data={pieData} />
            </div>
        </div>
    );
}
