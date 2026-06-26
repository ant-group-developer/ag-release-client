'use client';

import { Alert, Button, Card, Divider, Space, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { DnsInstructions } from '../../types';
import { useGetCfOAuthUrl } from '../../hooks/use-get-cf-oauth-url';
import { useVerifyTenantDomain } from '../../hooks/use-verify-tenant-domain';
import DnsInstructionsTable from '../dns-instructions-table';

interface Props {
    tenantId: string;
    dnsInstructions: DnsInstructions;
}

function DomainPendingView({ tenantId, dnsInstructions }: Props) {
    const t = useTranslations('tenantDomain');
    const { mutate: getCfOAuthUrl, isPending: isOAuthPending } = useGetCfOAuthUrl(tenantId);
    const { mutate: verify, isPending: isVerifying } = useVerifyTenantDomain(tenantId);

    function handleCfConnect() {
        getCfOAuthUrl(undefined, {
            onSuccess: (res) => {
                const url = res.data?.data?.url;
                if (url) window.location.href = url;
            },
        });
    }

    return (
        <div className="space-y-4">
            <Card
                title={
                    <Space>
                        <ThunderboltOutlined />
                        <span>{t('cfAuto.title')}</span>
                    </Space>
                }
            >
                <Typography.Paragraph type="secondary">
                    {t('cfAuto.description')}
                </Typography.Paragraph>
                <Button
                    type="primary"
                    loading={isOAuthPending}
                    onClick={handleCfConnect}
                >
                    {t('cfAuto.connectButton')}
                </Button>
            </Card>

            <Divider>{t('or')}</Divider>

            <div className="space-y-3">
                <Typography.Title level={5}>{t('manualSetup.title')}</Typography.Title>
                <DnsInstructionsTable
                    cnameRecord={dnsInstructions.cnameRecord}
                    txtRecord={dnsInstructions.txtRecord}
                />
                <Button
                    onClick={() => verify()}
                    loading={isVerifying}
                >
                    {t('action.checkStatus')}
                </Button>
            </div>
        </div>
    );
}

export default DomainPendingView;
