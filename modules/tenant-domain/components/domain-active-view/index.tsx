'use client';

import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Popconfirm, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useDeleteTenantDomain } from '../../hooks/use-delete-tenant-domain';
import { TenantDomainData } from '../../types';
import DomainStatusBadge from '../domain-status-badge';

interface Props {
    tenantId: string;
    domain: TenantDomainData;
}

function DomainActiveView({ tenantId, domain }: Props) {
    const t = useTranslations('tenantDomain');
    const { mutate: deleteDomain, isPending } = useDeleteTenantDomain(tenantId);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-xl text-green-500" />
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {t('active.title')}
                </Typography.Title>
            </div>

            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={t('field.domain')}>
                    <Typography.Link
                        href={`https://${domain.domain}`}
                        target="_blank"
                    >
                        {domain.domain}
                    </Typography.Link>
                </Descriptions.Item>
                <Descriptions.Item label={t('field.status')}>
                    <DomainStatusBadge status={domain.status} />
                </Descriptions.Item>
                <Descriptions.Item label={t('field.sslStatus')}>
                    {t(`sslStatus.${domain.sslStatus}`)}
                </Descriptions.Item>
            </Descriptions>

            <Popconfirm
                title={t('active.deleteConfirmTitle')}
                description={t('active.deleteConfirmDesc')}
                onConfirm={() => deleteDomain()}
                okButtonProps={{ danger: true, loading: isPending }}
            >
                <Button danger loading={isPending}>
                    {t('active.deleteButton')}
                </Button>
            </Popconfirm>
        </div>
    );
}

export default DomainActiveView;
