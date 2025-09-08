'use client';
import StreamChart from '@/modules/dashboard/components/area-chart/stream-chart';
import ListTop from '@/modules/dashboard/components/list-top';

type Props = {};

export default function Streams({}: Props) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <StreamChart className="!h-[350px]" />
            <ListTop className="lg:!grid-cols-2" />
        </div>
    );
}
