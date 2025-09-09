import AppCard from '@/components/ant-music/app-card';
import { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    data: {
        label: string;
        count: number;
    }[];
};

export default function StatCard({ title, data }: Props) {
    return (
        <AppCard title={title}>
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
