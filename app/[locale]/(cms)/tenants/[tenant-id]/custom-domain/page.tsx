'use client';

import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { tenantApi } from '@/modules/tenant/api';
import CustomDomainAutoSetup from '@/modules/tenant/components/custom-domain/custom-domain-auto-setup';
import CustomDomainDetails from '@/modules/tenant/components/custom-domain/custom-domain-details';
import CustomDomainDnsInstructions from '@/modules/tenant/components/custom-domain/custom-domain-dns-instructions';
import CustomDomainForm from '@/modules/tenant/components/custom-domain/custom-domain-form';
import { useCreateTenantDomain } from '@/modules/tenant/hooks/use-create-tenant-domain';
import { useDeleteTenantDomain } from '@/modules/tenant/hooks/use-delete-tenant-domain';
import { useGetTenantDomain } from '@/modules/tenant/hooks/use-get-tenant-domain';
import { useVerifyTenantDomain } from '@/modules/tenant/hooks/use-verify-tenant-domain';
import {
    CreateTenantDomainPayload,
    DNS_RECORD_TYPE,
    TENANT_DOMAIN_STATUS,
    TenantDomainData,
    TenantDomainResponse,
} from '@/modules/tenant/types/data';
import { Alert, Button, Popconfirm, Spin, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CF_ERROR_MESSAGES: Record<string, string> = {
    access_denied: 'tenant.customDomain.errors.access_denied',
    zone_not_found: 'tenant.customDomain.errors.zone_not_found',
    dns_create_failed: 'tenant.customDomain.errors.dns_create_failed',
    invalid_scope: 'tenant.customDomain.errors.invalid_scope',
    unauthorized: 'tenant.customDomain.errors.unauthorized',
};

function TenantCustomDomainPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { isAdmin } = useAuth();
    const searchParams = useSearchParams();
    const { handleError } = useApiNotify();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const { createTenantDomain, isPending } = useCreateTenantDomain();
    const { verifyTenantDomain, isPending: isVerifying } =
        useVerifyTenantDomain();
    const { deleteTenantDomain, isPending: isDeleting } =
        useDeleteTenantDomain();

    const [domainResult, setDomainResult] =
        useState<TenantDomainResponse | null>(null);

    const isPendingStatus =
        domainResult?.domain?.status === TENANT_DOMAIN_STATUS.PENDING ||
        domainResult?.domain?.status === TENANT_DOMAIN_STATUS.VERIFYING;

    const { data: tenantDomainData, isLoading } = useGetTenantDomain(tenantId, {
        refetchInterval: isPendingStatus ? 5000 : false,
    }) as any;

    const [cfSetupStatus, setCfSetupStatus] = useState<
        'success' | 'error' | null
    >(null);
    const [cfErrorMsg, setCfErrorMsg] = useState<string | null>(null);
    const [isFetchingOAuthUrl, setIsFetchingOAuthUrl] = useState(false);

    const isDomainActive =
        domainResult?.domain?.status === TENANT_DOMAIN_STATUS.ACTIVE;

    const showDnsInstructions =
        domainResult &&
        (domainResult.domain.status === TENANT_DOMAIN_STATUS.PENDING ||
            domainResult.domain.status === TENANT_DOMAIN_STATUS.FAILED ||
            domainResult.domain.status === TENANT_DOMAIN_STATUS.EXPIRED);

    useEffect(() => {
        if (tenantDomainData?.data?.data) {
            const data = tenantDomainData.data.data;
            if (data && 'dnsInstructions' in data) {
                setDomainResult(data as TenantDomainResponse);
            } else if (data) {
                const domainData = data as unknown as TenantDomainData;
                setDomainResult((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            domain: domainData,
                        };
                    }
                    return {
                        domain: domainData,
                        dnsInstructions: {
                            cnameRecord: {
                                type: DNS_RECORD_TYPE.CNAME,
                                name: domainData.domain,
                                value: '',
                            },
                            txtRecord: {
                                type: DNS_RECORD_TYPE.TXT,
                                name: `_cf-custom-hostname.${domainData.domain}`,
                                value: domainData.verificationToken ?? '',
                            },
                        },
                    } as TenantDomainResponse;
                });
            }
        }
    }, [tenantDomainData]);

    const onFinish = async (payload: CreateTenantDomainPayload) => {
        const response = await createTenantDomain({
            tenantId,
            payload: {
                domain: payload.domain.trim(),
            },
        });

        setDomainResult(response.data.data);
    };

    const triggerVerify = async () => {
        const response = await verifyTenantDomain({
            tenantId,
        });

        const data = response.data.data;
        if (data) {
            if ('dnsInstructions' in data) {
                setDomainResult(data as unknown as TenantDomainResponse);
            } else {
                setDomainResult((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        domain: data as TenantDomainData,
                    };
                });
            }
        }
    };

    const handleVerify = async () => {
        if (!domainResult) return;
        await triggerVerify();
    };

    const handleConnectCloudflare = async () => {
        setIsFetchingOAuthUrl(true);
        try {
            const response = await tenantApi.getCfOAuthUrl(tenantId, {
                returnUrl: window.location.href,
            });
            const url = response.data?.data?.url;
            // return;
            if (url) {
                window.location.href = url;
            } else {
                showNotification(
                    'error',
                    messages('common.somethingWentWrong')
                );
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsFetchingOAuthUrl(false);
        }
    };

    useEffect(() => {
        const cfSetup = searchParams.get('cf_setup');
        if (cfSetup === 'success') {
            setCfSetupStatus('success');
            triggerVerify();
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        } else if (cfSetup === 'error') {
            setCfSetupStatus('error');
            const cfError = searchParams.get('cf_error') || '';
            const cfErrorDesc = searchParams.get('cf_error_description') || '';
            const translationKey = CF_ERROR_MESSAGES[cfError];
            const friendlyMsg = translationKey
                ? messages(translationKey as any)
                : cfErrorDesc || messages('common.somethingWentWrong' as any);
            setCfErrorMsg(friendlyMsg);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams]);

    const handleDelete = async () => {
        await deleteTenantDomain({
            tenantId,
            onSuccess: () => {
                setDomainResult(null);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {!domainResult && (
                <CustomDomainForm
                    isAdmin={isAdmin}
                    isPending={isPending}
                    onSubmit={onFinish}
                />
            )}

            {domainResult && (
                <div
                    className="space-y-4 rounded-lg p-4"
                    style={{ background: token.colorBgContainer }}
                >
                    {cfSetupStatus === 'success' && (
                        <Alert
                            type="success"
                            showIcon
                            closable
                            message={messages(
                                'tenant.customDomain.autoSetupSuccess'
                            )}
                            className="mb-4"
                            onClose={() => setCfSetupStatus(null)}
                        />
                    )}

                    {cfSetupStatus === 'error' && (
                        <Alert
                            type="error"
                            showIcon
                            closable
                            message={cfErrorMsg}
                            className="mb-4"
                            onClose={() => setCfSetupStatus(null)}
                        />
                    )}

                    <CustomDomainDetails
                        domainResult={domainResult}
                        isDomainActive={isDomainActive}
                    />

                    {showDnsInstructions && (
                        <>
                            <CustomDomainAutoSetup
                                onConnectCloudflare={handleConnectCloudflare}
                                isFetchingOAuthUrl={isFetchingOAuthUrl}
                            />
                            <CustomDomainDnsInstructions
                                domainResult={domainResult}
                            />
                        </>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Popconfirm
                            title={messages(
                                'tenant.customDomain.deleteConfirm'
                            )}
                            onConfirm={handleDelete}
                            okText={messages('common.confirm') || 'OK'}
                            cancelText={messages('common.cancel') || 'Cancel'}
                            disabled={!isAdmin || isDeleting}
                        >
                            <Button
                                danger
                                loading={isDeleting}
                                disabled={!isAdmin}
                            >
                                {messages('tenant.customDomain.delete')}
                            </Button>
                        </Popconfirm>
                        {!isDomainActive &&
                            domainResult.domain.status !==
                                TENANT_DOMAIN_STATUS.VERIFYING && (
                                <Button
                                    type="primary"
                                    loading={isVerifying}
                                    disabled={!isAdmin}
                                    onClick={handleVerify}
                                >
                                    {messages('tenant.customDomain.verify')}
                                </Button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenantCustomDomainPage;
