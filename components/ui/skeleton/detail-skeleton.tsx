'use client';
import { PageContainer } from '@ant-design/pro-components';
import { Divider, Skeleton } from 'antd';

interface DetailSkeletonProps {}

export default function DetailSkeleton({}: DetailSkeletonProps) {
    return (
        <PageContainer>
            <div className="sticky top-0 z-10">
                <div className="flex h-16 w-fit items-center gap-1 py-2">
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
                </div>

                {/* Header skeleton */}
                <div className="flex gap-4 py-4">
                    <Skeleton.Avatar active shape="square" size={80} />
                    <div className="flex flex-1 flex-col space-y-3">
                        <Skeleton.Input active size="small" />
                        <Skeleton.Input active size="small" />
                    </div>
                </div>
            </div>
            <Divider />
            <div className="flex-1 py-4">
                <div className="h-64 w-full sm:h-72 md:h-80 lg:h-96 xl:h-[400px]">
                    <Skeleton.Node active={true} className="!h-full !w-full" />
                </div>
            </div>
        </PageContainer>
    );
}
