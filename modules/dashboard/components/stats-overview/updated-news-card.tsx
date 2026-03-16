import { Link } from '@/i18n/routing';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
        href: '#',
    },
    {
        id: '2',
        title: 'Content ID claim heatmap feature added',
        time: '1d ago',
        href: '#',
    },
    {
        id: '3',
        title: 'Revenue report now supports ISRC matching',
        time: '3d ago',
        href: '#',
    },
];

export default function NewsUpdatedCard() {
    const messages = useTranslations();
    return (
        <Card
            title="Updated news"
            styles={{ body: { padding: 0, height: '80%' } }}
        >
            <div className="flex h-full flex-col justify-between">
                <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {updates.map((item) => (
                        <li key={item.id}>
                            <a
                                href={item.href}
                                className="flex cursor-pointer items-start gap-3 rounded-md px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >
                                <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                                <div className="flex flex-col">
                                    <Typography>{item.title}</Typography>
                                    <Typography.Text type="secondary">
                                        {item.time}
                                    </Typography.Text>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="mt-3 flex justify-end p-4">
                    <Link
                        href="#"
                        className="space-x-1 text-xs hover:!text-blue-500"
                    >
                        <span>{messages('dashboard.viewAllUpdates')}</span>
                        <ArrowRightOutlined />
                    </Link>
                </div>
            </div>
        </Card>
    );
}
