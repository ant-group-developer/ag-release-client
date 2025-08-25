'use client';
import { SIZE_ICON_SMALL } from '@/constants/common';
import { Skeleton, Tabs } from 'antd';
import { ArrowLeft } from 'lucide-react';

interface DetailSkeletonProps {
    showTabs?: boolean;
    itemCount?: number;
}

export default function DetailSkeleton({
    showTabs = true,
    itemCount = 5,
}: DetailSkeletonProps) {
    return (
        <div className="mx-auto max-w-screen-2xl px-2">
            <div className="sticky top-0 z-10">
                <div className="flex w-fit items-center gap-1 py-2">
                    <ArrowLeft size={SIZE_ICON_SMALL} />
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
                </div>

                {/* Header skeleton */}
                <div className="flex gap-4 py-4">
                    <Skeleton.Avatar active shape="square" size={80} />
                    <div className="flex-1 space-y-3">
                        {Array.from({ length: itemCount }).map((_, idx) => (
                            <Skeleton.Input
                                key={idx}
                                active
                                size="small"
                                style={{ width: idx % 2 === 0 ? 200 : 120 }}
                            />
                        ))}
                    </div>
                </div>

                {showTabs && (
                    <Tabs
                        className="!pt-0"
                        items={[
                            {
                                key: '1',
                                label: (
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: 100 }}
                                    />
                                ),
                            },
                            {
                                key: '2',
                                label: (
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: 100 }}
                                    />
                                ),
                            },
                        ]}
                    />
                )}
            </div>
            <div className="flex-1 py-4">
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        </div>
    );
}
