'use client';

import { Alert, Button, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { DnsInstructions } from '../../types';
import { useVerifyTenantDomain } from '../../hooks/use-verify-tenant-domain';
import DnsInstructionsTable from '../dns-instructions-table';

interface Props {
    tenantId: string;
    dnsInstructions: DnsInstructions | null;
}

function DomainFailedView({ tenantId, dnsInstructions }: Props) {
    const t = useTranslations('tenantDomain');
    const { mutate: verify, isPending } = useVerifyTenantDomain(tenantId);

    return (
        <div className="space-y-4">
            <Alert type="error" showIcon message={t('failed.description')} />

            {dnsInstructions && (
                <>
                    <Typography.Title level={5}>
                        {t('manualSetup.title')}
                    </Typography.Title>
                    <DnsInstructionsTable
                        cnameRecord={dnsInstructions.cnameRecord}
                        txtRecord={dnsInstructions.txtRecord}
                    />
                </>
            )}

            <Button onClick={() => verify()} loading={isPending}>
                {t('action.checkStatus')}
            </Button>
        </div>
    );
}

export default DomainFailedView;
