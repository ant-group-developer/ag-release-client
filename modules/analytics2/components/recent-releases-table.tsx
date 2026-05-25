'use client';

import { Card, Table, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { RELEASE_DATA } from '../constants/mock-data';

export default function RecentReleasesTable() {
    const messages = useTranslations();

    const columns = [
        {
            title: messages('common.release'),
            dataIndex: 'release',
            key: 'release',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.cover}
                        alt={text}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900 dark:text-zinc-100">{text}</span>
                </div>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'tracks',
            key: 'tracks',
            align: 'center' as const,
        },
        {
            title: 'Videos',
            dataIndex: 'videos',
            key: 'videos',
            align: 'center' as const,
        },
        {
            title: messages('common.views'),
            dataIndex: 'viewsStr',
            key: 'views',
            align: 'right' as const,
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueStr',
            key: 'revenue',
            align: 'right' as const,
            render: (text: string) => (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {text}
                </span>
            ),
        },
        {
            title: messages('common.releaseDate'),
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            align: 'center' as const,
            render: (date: string) => {
                return (
                    <span className="text-gray-500 dark:text-zinc-400">
                        {formattedDate(date, DATE_FORMAT.DATE_ONLY)}
                    </span>
                );
            },
        },
    ];

    return (
        <Card
            title={
                <div className="flex items-center gap-2 py-1">
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('dashboard.recentReleases') || 'Recent releases'}
                    </span>
                </div>
            }
        >
            <Table
                columns={columns}
                dataSource={RELEASE_DATA}
                pagination={false}
                className="analytics-tabs"
            />
        </Card>
    );
}
