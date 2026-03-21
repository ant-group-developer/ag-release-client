'use client';

import { Card } from 'antd';
import {
    ArrowDownRight,
    ArrowUpRight,
    Music,
    Play,
    ThumbsUp,
    Video,
} from 'lucide-react';
import { METRICS_DATA } from '../constants/mock-data';

const IconMap: Record<string, any> = {
    tiktok: Video,
    streams: Music,
    listeners: Play,
    likes: ThumbsUp,
    saves: Music,
};

export default function MetricCards() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {METRICS_DATA.map((metric, index) => {
                const Icon = IconMap[metric.icon] || Video;
                return (
                    <Card
                        key={index}
                        className="rounded-xl border-none shadow-sm"
                        styles={{ body: { padding: '16px' } }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    {metric.title}
                                </span>
                                {/* <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: metric.color }}
                                /> */}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">
                                    {metric.value}
                                </span>
                            </div>
                            <div
                                className={`flex items-center text-xs font-semibold ${
                                    metric.isPositive
                                        ? 'text-blue-500'
                                        : 'text-gray-400'
                                }`}
                            >
                                {metric.isPositive ? (
                                    <ArrowUpRight className="mr-0.5 h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="mr-0.5 h-3 w-3" />
                                )}
                                {metric.change}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
