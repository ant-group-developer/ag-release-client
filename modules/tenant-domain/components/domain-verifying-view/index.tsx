'use client';

import { Alert, Button, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useVerifyTenantDomain } from '../../hooks/use-verify-tenant-domain';

interface Props {
    tenantId: string;
}

function DomainVerifyingView({ tenantId }: Props) {
    const t = useTranslations('tenantDomain');
    const { mutate: verify, isPending } = useVerifyTenantDomain(tenantId);

    return (
        <div className="space-y-4">
            <Space>
                <Spin indicator={<LoadingOutlined />} />
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {t('verifying.title')}
                </Typography.Title>
            </Space>

            <Alert
                type="info"
                showIcon
                message={t('verifying.description')}
            />

            <Button onClick={() => verify()} loading={isPending}>
                {t('action.checkStatus')}
            </Button>
        </div>
    );
}

export default DomainVerifyingView;
