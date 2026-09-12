'use client';

import { formattedNumber } from '@/helpers/common';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import { Avatar, Button, Card, Table, Tag, theme, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRight, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { MOCK_RECENT_TRANSACTIONS } from '../../constants/mock-data';
import { RoyaltyTransactionItem, TransactionStatus } from '../../types';

interface WorkspaceCellProps {
    name?: string;
    logo?: string | null;
}

const WorkspaceCell: React.FC<WorkspaceCellProps> = ({ name, logo }) => {
    return (
        <div className="flex max-w-[180px] items-center gap-2">
            <Avatar src={logo} size={24} className="flex-shrink-0">
                {name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography.Text
                strong
                className="truncate text-xs"
                ellipsis={{ tooltip: name }}
            >
                {name}
            </Typography.Text>
        </div>
    );
};

interface TransactionStatusTagProps {
    status: TransactionStatus;
    label: string;
}

const TransactionStatusTag: React.FC<TransactionStatusTagProps> = ({
    status,
    label,
}) => {
    switch (status) {
        case 'paid':
            return (
                <Tag color="success" className="!mr-0 !rounded-full px-2.5">
                    {label}
                </Tag>
            );
        case 'pending':
            return (
                <Tag color="warning" className="!mr-0 !rounded-full px-2.5">
                    {label}
                </Tag>
            );
        case 'available':
            return (
                <Tag color="processing" className="!mr-0 !rounded-full px-2.5">
                    {label}
                </Tag>
            );
        default:
            return <Tag className="!mr-0 !rounded-full px-2.5">{label}</Tag>;
    }
};

interface RecentTransactionsCardProps {
    data?: RoyaltyTransactionItem[];
    totalCount?: number;
    onViewAll?: () => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
    data,
    totalCount,
    onViewAll,
}) => {
    const t = useTranslations('financial');
    const tCommon = useTranslations('common');
    const { token } = theme.useToken();

    // Call API get active workspaces để lấy logo thật nếu có
    const { data: tenantData } = useTenantActive();

    // Map đúng 4 workspace được chỉ định: Beta Music, VT Music, 22R, Cre8tive
    const dataSource: RoyaltyTransactionItem[] = useMemo(() => {
        if (data && data.length > 0) {
            return data.slice(0, 4);
        }

        const apiItems = tenantData?.items || [];

        return MOCK_RECENT_TRANSACTIONS.map((item) => {
            const itemWsName = item.workspaceName?.trim().toLowerCase();
            const matchedApiWs = itemWsName
                ? apiItems.find((ws) => {
                      const apiName = (ws.name || ws.title || '')
                          .trim()
                          .toLowerCase();
                      return apiName === itemWsName;
                  })
                : undefined;

            return {
                ...item,
                workspaceLogo:
                    matchedApiWs?.logo ||
                    matchedApiWs?.icon ||
                    (matchedApiWs as any)?.thumbnail ||
                    item.workspaceLogo,
            };
        });
    }, [data, tenantData]);

    const totalTransactions = totalCount ?? 4;

    const columns: ColumnsType<RoyaltyTransactionItem> = [
        {
            title: t('date'),
            dataIndex: 'date',
            key: 'date',
            render: (val) => (
                <Typography.Text className="text-xs">{val}</Typography.Text>
            ),
        },
        {
            title: tCommon('workspace'),
            key: 'workspace',
            render: (_, record) => (
                <WorkspaceCell
                    name={record.workspaceName}
                    logo={record.workspaceLogo}
                />
            ),
        },
        {
            title: t('period'),
            dataIndex: 'period',
            key: 'period',
            render: (val) => (
                <Typography.Text type="secondary" className="text-xs">
                    {val}
                </Typography.Text>
            ),
        },
        {
            title: t('type'),
            dataIndex: 'type',
            key: 'type',
            render: () => (
                <Typography.Text className="text-xs">
                    {t('royalty')}
                </Typography.Text>
            ),
        },
        {
            title: t('amount'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (val) => (
                <Typography.Text strong className="text-xs">
                    $ {formattedNumber(val)}
                </Typography.Text>
            ),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            align: 'right',
            render: (val: TransactionStatus) => (
                <TransactionStatusTag status={val} label={t(val)} />
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
            <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <Typography.Title
                    level={4}
                    style={{ margin: 0, fontWeight: 600 }}
                >
                    {t('recentTransactions')}
                </Typography.Title>
            </div>

            <div className="flex-1 overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={false}
                    pagination={false}
                    size="small"
                    className="financial-table"
                    scroll={{ x: 'max-content' }}
                />
            </div>

            <div
                className="mt-2 flex items-center justify-between border-t pt-4"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <Typography.Text type="secondary" className="text-xs">
                    {t('showingOfTransactions', {
                        current: dataSource.length,
                        total: totalTransactions,
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
