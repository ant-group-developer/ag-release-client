import AppCard from '@/components/ant-music/app-card';
import { Skeleton } from 'antd';
import { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    data: {
        label: string;
        count: number;
    }[];
    loading?: boolean;
    className?: string;
};

export default function StatCard({
    className,
    loading = false,
    title,
    data,
}: Props) {
    if (loading) {
        return <Skeleton active className="rounded-lg border px-4 py-2" />;
    }
    return (
        <AppCard title={title} className={className}>
            <div className="space-y-2 px-4 pb-4">
                {data?.map((item, index) => {
                    return (
                        <div key={index} className="flex justify-between">
                            <div>{item?.label}</div>
                            <div>{item?.count}</div>
                        </div>
                    );
                })}
            </div>
        </AppCard>
    );
}
