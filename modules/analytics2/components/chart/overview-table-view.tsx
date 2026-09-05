'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Card, Empty, Skeleton, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

interface OverviewTableViewProps {
    title: React.ReactNode;
    data: any[];
    xAxisKey: string;
    valueKey: string;
    valueName: string;
    chartHeight?: number;
    loading?: boolean;
    valuePrefix?: string;
    className?: string;
}

export default function OverviewTableView({
    title,
    data,
    xAxisKey,
    valueKey,
    valueName,
    chartHeight = 400,
    loading = false,
    valuePrefix = '',
    className = '',
}: OverviewTableViewProps) {
    const messages = useTranslations();

    const columns: ColumnsType<any> = [
        {
            title: messages('common.period'),
            dataIndex: xAxisKey,
            key: xAxisKey,
            width: '70%',
            render: (text: any) => {
                return (
                    <Typography.Text>
                        {formattedDate(text, DATE_FORMAT.MONTH_YEAR)}
                    </Typography.Text>
                );
            },
        },
        {
            title: valueName,
            dataIndex: valueKey,
            key: valueKey,
            width: '30%',
            align: 'left',
            render: (val: any) => (
                <Typography.Text strong>
                    {valuePrefix}
                    {formattedNumber(val ?? 0)}
                </Typography.Text>
            ),
        },
    ];

    const tableData = data.map((item, index) => ({
        ...item,
        key: item[xAxisKey] || index,
    }));

    return (
        <Card
            className={cn('h-full rounded-xl border-none shadow-sm', className)}
            styles={{
                body: {
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {typeof title === 'string' ? (
                    <span className="text-base font-bold">{title}</span>
                ) : (
                    title
                )}
            </div>

            {loading ? (
                <div style={{ height: chartHeight, minHeight: chartHeight }}>
                    <Skeleton active paragraph={{ rows: 5 }} />
                </div>
            ) : data.length === 0 ? (
                <div
                    style={{
                        height: chartHeight,
                        minHeight: chartHeight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="py-12"
                        description={messages('common.noDataAvailable')}
                    />
                </div>
            ) : (
                <div
                    className="flex w-full flex-1 flex-col justify-between overflow-hidden"
                    style={{
                        height: chartHeight,
                        minHeight: chartHeight,
                        maxHeight: chartHeight,
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                        }}
                        size="small"
                        className="w-full flex-1"
                        scroll={{ y: 145 }}
                    />
                </div>
            )}
        </Card>
    );
}
