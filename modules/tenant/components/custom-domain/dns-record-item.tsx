import { TenantDomainDnsRecord } from '@/modules/tenant/types/data';
import { Typography } from 'antd';

interface DnsRecordItemProps {
    record: TenantDomainDnsRecord;
}

export default function DnsRecordItem({ record }: DnsRecordItemProps) {
    return (
        <div className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
                <Typography.Text copyable={{ text: record.name }}>
                    <span className="truncate font-medium">{record.name}</span>
                </Typography.Text>
                <Typography.Text copyable={{ text: record.value }}>
                    <span className="truncate font-medium">{record.value}</span>
                </Typography.Text>
            </div>
        </div>
    );
}
