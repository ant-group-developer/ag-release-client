'use client';

import AppLoader from '@/components/app-loader';
import { Alert, Card, Skeleton, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useVerifyTenantDomain } from '../../hooks/use-verify-tenant-domain';
import { useGetTenantDomain } from '../../hooks/use-get-tenant-domain';
import { DOMAIN_STATUS } from '../../enums';
import DomainActiveView from '../domain-active-view';
import DomainFailedView from '../domain-failed-view';
import DomainPendingView from '../domain-pending-view';
import DomainVerifyingView from '../domain-verifying-view';
import RegisterDomainForm from '../register-domain-form';

interface Props {
    tenantId: string;
}

function TenantDomainModule({ tenantId }: Props) {
    const t = useTranslations('tenantDomain');
    const searchParams = useSearchParams();
    const cfSetup = searchParams.get('cf_setup');

    const { domainData, isLoading, error } = useGetTenantDomain(tenantId);
    const { mutate: verify, isPending: isVerifying } = useVerifyTenantDomain(tenantId);

    useEffect(() => {
        if (cfSetup === 'success') {
            verify();
        }
    }, [cfSetup]);

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 4 }} />;
    }

    const is404 =
        error &&
        (error as any)?.response?.data?.messageCode === 'tenant_domain.error.notFound';

    function renderContent() {
        if (is404 || !domainData) {
            return (
                <div className="space-y-4">
                    <Typography.Paragraph type="secondary">
                        {t('noDomain.description')}
                    </Typography.Paragraph>
                    <RegisterDomainForm tenantId={tenantId} />
                </div>
            );
        }

        const { domain, dnsInstructions } = domainData;

        switch (domain.status) {
            case DOMAIN_STATUS.PENDING:
            case DOMAIN_STATUS.FAILED:
                return dnsInstructions && domain.status === DOMAIN_STATUS.PENDING ? (
                    <DomainPendingView
                        tenantId={tenantId}
                        dnsInstructions={dnsInstructions}
                    />
                ) : (
                    <DomainFailedView
                        tenantId={tenantId}
                        dnsInstructions={dnsInstructions}
                    />
                );

            case DOMAIN_STATUS.VERIFYING:
                return <DomainVerifyingView tenantId={tenantId} />;

            case DOMAIN_STATUS.ACTIVE:
                return (
                    <DomainActiveView tenantId={tenantId} domain={domain} />
                );

            case DOMAIN_STATUS.EXPIRED:
                return (
                    <div className="space-y-4">
                        <Alert
                            type="warning"
                            showIcon
                            message={t('expired.description')}
                        />
                        {dnsInstructions && (
                            <DomainPendingView
                                tenantId={tenantId}
                                dnsInstructions={dnsInstructions}
                            />
                        )}
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <>
            {isVerifying && <AppLoader />}
            {cfSetup === 'success' && (
                <Alert
                    type="success"
                    showIcon
                    message={t('cfAuto.setupSuccess')}
                    className="mb-4"
                    closable
                />
            )}
            {cfSetup === 'error' && (
                <Alert
                    type="error"
                    showIcon
                    message={t('cfAuto.setupError')}
                    className="mb-4"
                    closable
                />
            )}
            <Card title={t('cardTitle')}>{renderContent()}</Card>
        </>
    );
}

export default TenantDomainModule;
