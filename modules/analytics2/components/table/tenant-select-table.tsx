import { removeEmptyChildren } from '@/helpers/array';
import TenantTag from '@/modules/tenant/components/tenant-tag';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import { getTenantAvatar, getTenantOwnerEmail } from '@/modules/tenant/utils';
import { Avatar, Table, Typography } from 'antd';
import { useTranslations } from 'next-intl';

const DEFAULT_AVATAR_SIZE = 24;
const DEFAULT_TABLE_SCROLL_Y = 250;

interface TenantSelectTableProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

export default function TenantSelectTable({
    value = [],
    onChange,
}: TenantSelectTableProps) {
    const messages = useTranslations();
    const { data, isLoading } = useTenantActive();
    const dataSource = removeEmptyChildren(data?.items ?? []);

    const columns = [
        {
            title: messages('tenant.name'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: any) => (
                <div className="inline-flex items-center gap-2 align-middle overflow-hidden">
                    <Avatar
                        src={getTenantAvatar({
                            logo: record.logo,
                            icon: record.icon,
                            name: record.name,
                        })}
                        size={DEFAULT_AVATAR_SIZE}
                        shape="square"
                    />
                    <Typography.Text
                        ellipsis={{ tooltip: name }}
                        className="max-w-[200px]"
                    >
                        {name}
                    </Typography.Text>
                </div>
            ),
        },
        {
            title: messages('tenant.owner'),
            dataIndex: 'ownerEmail',
            key: 'ownerEmail',
            render: (_: any, record: any) => {
                const ownerEmail = getTenantOwnerEmail(record.tenantUser);
                return (
                    <Typography.Text
                        ellipsis={{ tooltip: ownerEmail }}
                        className="max-w-[180px]"
                    >
                        {ownerEmail || '-'}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('tenant.type.title'),
            dataIndex: 'type',
            key: 'type',
            render: (_: any, record: any) =>
                record.type ? <TenantTag type={record.type} /> : '-',
        },
    ];

    if (isLoading) {
        return (
            <Table
                loading={true}
                dataSource={[]}
                columns={columns}
                size="small"
                pagination={false}
            />
        );
    }

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={false}
            scroll={{ y: DEFAULT_TABLE_SCROLL_Y }}
            defaultExpandAllRows={true}
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys: value ?? [],
                onChange: (selectedKeys) => {
                    onChange?.(selectedKeys as string[]);
                },
            }}
            size="small"
        />
    );
}


