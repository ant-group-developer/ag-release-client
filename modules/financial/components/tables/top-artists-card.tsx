'use client';

import { formattedNumber } from '@/helpers/common';
import { Avatar, Button, Card, Table, theme, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRight, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { MOCK_TOP_ARTISTS } from '../../constants/mock-data';
import { TopArtistRevenueItem } from '../../types';

interface TopArtistsCardProps {
    fromDate?: string;
    toDate?: string;
    onViewAll?: () => void;
}

export const TopArtistsCard: React.FC<TopArtistsCardProps> = ({
    onViewAll,
}) => {
    const t = useTranslations('financial');
    const tCommon = useTranslations('common');
    const { token } = theme.useToken();

    // Dữ liệu tĩnh 14 nghệ sĩ theo yêu cầu (không lấy từ API)
    const dataSource: TopArtistRevenueItem[] = MOCK_TOP_ARTISTS;

    const columns: ColumnsType<TopArtistRevenueItem> = [
        {
            title: '#',
            dataIndex: 'rank',
            key: 'rank',
            width: 36,
            align: 'center',
            render: (val) => (
                <Typography.Text
                    type="secondary"
                    className="text-xs font-semibold"
                >
                    {val}
                </Typography.Text>
            ),
        },
        {
            title: t('artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            ellipsis: true,
            render: (_, record) => (
                <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar
                        src={record.picture}
                        size={32}
                        className="flex-shrink-0"
                    >
                        {record.artistName?.[0]}
                    </Avatar>
                    <Typography.Text
                        strong
                        className="truncate text-xs"
                        ellipsis={{ tooltip: record.artistName }}
                    >
                        {record.artistName}
                    </Typography.Text>
                </div>
            ),
        },
        {
            title: t('labelCol'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 150,
            ellipsis: true,
            render: (val) => (
                <Typography.Text
                    type="secondary"
                    className="truncate text-xs"
                    ellipsis={{ tooltip: val }}
                >
                    {val}
                </Typography.Text>
            ),
        },
        {
            title: t('revenue'),
            dataIndex: 'revenue',
            key: 'revenue',
            align: 'right',
            width: 140,
            render: (val) => (
                <Typography.Text strong className="whitespace-nowrap text-xs">
                    $ {formattedNumber(val)}
                </Typography.Text>
            ),
        },
    ];

    return (
        <Card
            className="h-full rounded-xl border shadow-sm"
            style={{
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
            }}
            styles={{
                body: {
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                },
            }}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <Typography.Title
                        level={4}
                        style={{ margin: 0, fontWeight: 600 }}
                    >
                        {t('topArtistsByRevenue')}
                    </Typography.Title>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="rank"
                    loading={false}
                    pagination={false}
                    size="small"
                    className="financial-table"
                />
            </div>

            <div
                className="mt-2 flex items-center justify-between border-t pt-4"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <Typography.Text type="secondary" className="text-xs">
                    {t('showingOfArtists', {
                        current: dataSource.length,
                        total: 48,
                    })}
                </Typography.Text>
                <Button
                    type="link"
                    size="small"
                    onClick={onViewAll}
                    className="flex items-center gap-1 p-0 text-xs"
                >
                    {tCommon('viewAll')}
                    <ArrowRight className="h-3.5 w-3.5" />
                </Button>
            </div>
        </Card>
    );
};
