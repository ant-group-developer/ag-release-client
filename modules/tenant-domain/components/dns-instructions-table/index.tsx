'use client';

import { Alert, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { DnsRecord } from '../../types';

interface Props {
    cnameRecord: DnsRecord;
    txtRecord: DnsRecord;
}

function DnsInstructionsTable({ cnameRecord, txtRecord }: Props) {
    const t = useTranslations('tenantDomain');

    const columns: ColumnsType<DnsRecord> = [
        {
            title: t('dns.type'),
            dataIndex: 'type',
            key: 'type',
            width: 80,
        },
        {
            title: t('dns.name'),
            dataIndex: 'name',
            key: 'name',
            render: (val: string) => (
                <Typography.Text copyable code>
                    {val}
                </Typography.Text>
            ),
        },
        {
            title: t('dns.value'),
            dataIndex: 'value',
            key: 'value',
            render: (val: string) => (
                <Typography.Text copyable code>
                    {val}
                </Typography.Text>
            ),
        },
    ];

    return (
        <div className="space-y-3">
            <Table<DnsRecord>
                columns={columns}
                dataSource={[cnameRecord, txtRecord]}
                rowKey="type"
                pagination={false}
                size="small"
            />
            <Alert
                type="warning"
                showIcon
                message={t('dns.propagationWarning')}
            />
        </div>
    );
}

export default DnsInstructionsTable;
