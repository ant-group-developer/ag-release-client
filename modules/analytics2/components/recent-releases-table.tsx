'use client';

import {
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_MOBILE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { DATE_FORMAT, ORDER } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData } from '@/modules/releases/types';
import { Card, Skeleton, Table } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
interface Props {
    fromDate: string;
    toDate: string;
}

export default function RecentReleasesTable({ fromDate, toDate }: Props) {
    const messages = useTranslations();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_MOBILE);

    const { releasesData, isFetching } = useGetListReleases({
        page,
        pageSize,
        fieldOrder: 'releaseDate',
        orderBy: ORDER.DESC,
        startDateRelease: fromDate,
        endDateRelease: toDate,
    });

    const columns = [
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            render: (text: string, record: ReleasesData) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage data={record} />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                            {text}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'artists',
            width: 400,
            render: (_: any, record: ReleasesData) => {
                const artists = record.releaseArtists
                    ?.map((ra) => ra.artist?.name)
                    .filter(Boolean)
                    .join(', ');
                return (
                    <span className="text-gray-600 dark:text-zinc-400">
                        {artists || '—'}
                    </span>
                );
            },
        },
        {
            title: messages('common.label'),
            key: 'label',
            width: 250,
            render: (_: any, record: ReleasesData) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record.label?.name || '—'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'tracksCount',
            key: 'tracksCount',
            width: 150,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.releaseDate'),
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            width: 150,
            render: (date: string) => (
                <span className="text-gray-500 dark:text-zinc-400">
                    {date ? formattedDate(date, DATE_FORMAT.DATE_ONLY) : '—'}
                </span>
            ),
        },
    ];

    return (
        <Card
            title={
                <div className="flex items-center gap-2 py-1">
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('dashboard.recentReleases')}
                    </span>
                </div>
            }
        >
            {isFetching && !releasesData.items.length ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={releasesData.items}
                    rowKey="id"
                    loading={isFetching}
                    className="analytics-tabs"
                    pagination={{
                        current: page,
                        pageSize,
                        total: releasesData.metadata?.totalItems,
                        pageSizeOptions: PAGE_SIZE_OPTIONS.filter(
                            (s) => s <= PAGE_SIZE_DEFAULT
                        ),
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / ${total}`,
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setPageSize(newPageSize);
                        },
                    }}
                />
            )}
        </Card>
    );
}
