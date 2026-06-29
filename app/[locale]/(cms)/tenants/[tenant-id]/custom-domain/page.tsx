'use client';

import SubmitButton from '@/components/ui/button/submit-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useCreateTenantDomain } from '@/modules/tenant/hooks/use-create-tenant-domain';
import { useDeleteTenantDomain } from '@/modules/tenant/hooks/use-delete-tenant-domain';
import { useGetTenantDomain } from '@/modules/tenant/hooks/use-get-tenant-domain';
import { useVerifyTenantDomain } from '@/modules/tenant/hooks/use-verify-tenant-domain';
import {
    CreateTenantDomainPayload,
    DNS_RECORD_TYPE,
    TENANT_DOMAIN_SSL_STATUS,
    TENANT_DOMAIN_STATUS,
    TenantDomainData,
    TenantDomainDnsRecord,
    TenantDomainResponse,
} from '@/modules/tenant/types/data';
import {
    Alert,
    Button,
    Descriptions,
    Form,
    Input,
    Popconfirm,
    Spin,
    Tag,
    theme,
    Typography,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const TENANT_DOMAIN_STATUS_COLORS: Record<TENANT_DOMAIN_STATUS, string> = {
    [TENANT_DOMAIN_STATUS.PENDING]: 'gold',
    [TENANT_DOMAIN_STATUS.ACTIVE]: 'green',
    [TENANT_DOMAIN_STATUS.FAILED]: 'red',
};

const TENANT_DOMAIN_SSL_STATUS_COLORS: Record<
    TENANT_DOMAIN_SSL_STATUS,
    string
> = {
    [TENANT_DOMAIN_SSL_STATUS.PENDING]: 'gold',
    [TENANT_DOMAIN_SSL_STATUS.ACTIVE]: 'green',
    [TENANT_DOMAIN_SSL_STATUS.FAILED]: 'red',
};

function DnsRecordItem({ record }: { record: TenantDomainDnsRecord }) {
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

function TenantCustomDomainPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [form] = Form.useForm<CreateTenantDomainPayload>();
    const { isAdmin } = useAuth();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const { createTenantDomain, isPending } = useCreateTenantDomain();
    const { verifyTenantDomain, isPending: isVerifying } =
        useVerifyTenantDomain();
    const { deleteTenantDomain, isPending: isDeleting } =
        useDeleteTenantDomain();
    const { data: tenantDomainData, isLoading } = useGetTenantDomain(tenantId);

    const [domainResult, setDomainResult] =
        useState<TenantDomainResponse | null>(null);

    const isDomainActive =
        domainResult?.domain?.status === TENANT_DOMAIN_STATUS.ACTIVE;

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
        form.resetFields();
    };

    const handleVerify = async () => {
        if (!domainResult) return;
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
                <div
                    className="rounded-lg p-4"
                    style={{ background: token.colorBgContainer }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        disabled={!isAdmin || isPending}
                    >
                        <label
                            className="mb-2 block text-sm font-medium"
                            style={{ color: token.colorText }}
                        >
                            {messages('tenant.customDomain.label')}
                        </label>
                        <div className="flex items-start gap-2">
                            <Form.Item
                                className="mb-0 !w-full flex-1"
                                name="domain"
                                rules={[
                                    {
                                        required: true,
                                        message: messages(
                                            'tenant.customDomain.validation.required'
                                        ),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={messages(
                                        'tenant.customDomain.placeholder'
                                    )}
                                    allowClear
                                />
                            </Form.Item>

                            <SubmitButton
                                htmlType="submit"
                                loading={isPending}
                            />
                        </div>
                    </Form>
                </div>
            )}

            {domainResult && (
                <div
                    className="space-y-4 rounded-lg p-4"
                    style={{ background: token.colorBgContainer }}
                >
                    {!isDomainActive && (
                        <Alert
                            type="info"
                            showIcon
                            message={messages('tenant.customDomain.dnsTitle')}
                            description={messages(
                                'tenant.customDomain.dnsDescription'
                            )}
                        />
                    )}

                    <Descriptions
                        bordered
                        column={{ xs: 1, md: 2 }}
                        items={[
                            {
                                key: 'domain',
                                label: messages('tenant.domain'),
                                children: (
                                    <CopyText text={domainResult.domain.domain}>
                                        {domainResult.domain.domain}
                                    </CopyText>
                                ),
                            },
                            {
                                key: 'status',
                                label: messages('common.status'),
                                children: (
                                    <Tag
                                        color={
                                            TENANT_DOMAIN_STATUS_COLORS[
                                                domainResult.domain.status
                                            ]
                                        }
                                    >
                                        {domainResult.domain.status}
                                    </Tag>
                                ),
                            },
                            {
                                key: 'sslStatus',
                                label: messages(
                                    'tenant.customDomain.sslStatus'
                                ),
                                children: (
                                    <Tag
                                        color={
                                            TENANT_DOMAIN_SSL_STATUS_COLORS[
                                                domainResult.domain.sslStatus
                                            ]
                                        }
                                    >
                                        {domainResult.domain.sslStatus}
                                    </Tag>
                                ),
                            },
                            ...(!isDomainActive
                                ? [
                                      {
                                          key: 'verificationToken',
                                          label: messages(
                                              'tenant.customDomain.verificationToken'
                                          ),
                                          children: (
                                              <CopyText
                                                  text={
                                                      domainResult.domain
                                                          .verificationToken ??
                                                      ''
                                                  }
                                              >
                                                  {domainResult.domain
                                                      .verificationToken ??
                                                      messages(
                                                          'common.notAvailable'
                                                      )}
                                              </CopyText>
                                          ),
                                      },
                                  ]
                                : []),
                        ]}
                    />

                    {!isDomainActive && (
                        <Descriptions
                            bordered
                            column={1}
                            items={[
                                {
                                    key: 'cnameRecord',
                                    label: messages(
                                        'tenant.customDomain.cnameRecord'
                                    ),
                                    children: (
                                        <DnsRecordItem
                                            record={
                                                domainResult?.dnsInstructions
                                                    ?.cnameRecord
                                            }
                                        />
                                    ),
                                },
                                {
                                    key: 'txtRecord',
                                    label: messages(
                                        'tenant.customDomain.txtRecord'
                                    ),
                                    children: (
                                        <DnsRecordItem
                                            record={
                                                domainResult.dnsInstructions
                                                    .txtRecord
                                            }
                                        />
                                    ),
                                },
                            ]}
                        />
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
                        {!isDomainActive && (
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
