import AppCard from '@/components/ant-music/app-card';
import { Bell } from 'lucide-react';

type UpdateItem = {
    id: string;
    title: string;
    time: string;
    href?: string;
};

const updates: UpdateItem[] = [
    {
        id: '1',
        title: 'New analytics dashboard with DSP trends',
        time: '2h ago',
        href: '/updates/analytics-dashboard',
    },
    {
        id: '2',
        title: 'Content ID claim heatmap feature added',
        time: '1d ago',
        href: '/updates/claim-heatmap',
    },
    {
        id: '3',
        title: 'Revenue report now supports ISRC matching',
        time: '3d ago',
        href: '/updates/revenue-isrc',
    },
];

export default function NewsUpdatedCard() {
    return (
        <AppCard title="Updated news" className="bg-white">
            <ul className="divide-y divide-gray-200">
                {updates.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            className="flex cursor-pointer items-start gap-3 rounded-md px-4 py-3 transition hover:bg-gray-50"
                        >
                            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                                    {item.title}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {item.time}
                                </span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="mt-3 flex justify-end p-4">
                <a
                    href="/updates"
                    className="text-xs font-medium text-blue-600 hover:underline"
                >
                    View all updates →
                </a>
            </div>
        </AppCard>
    );
}
