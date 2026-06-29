import { TenantDomainResponse } from '@/modules/tenant/types/data';
import { Alert, Descriptions, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import DnsRecordItem from './dns-record-item';

interface CustomDomainDnsInstructionsProps {
    domainResult: TenantDomainResponse;
}

export default function CustomDomainDnsInstructions({
    domainResult,
}: CustomDomainDnsInstructionsProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const dnsInstructionsItems = useMemo(() => {
        if (!domainResult) return [];
        return [
            {
                key: 'cnameRecord',
                label: messages('tenant.customDomain.cnameRecord'),
                children: (
                    <DnsRecordItem
                        record={domainResult?.dnsInstructions?.cnameRecord}
                    />
                ),
            },
            {
                key: 'txtRecord',
                label: messages('tenant.customDomain.txtRecord'),
                children: (
                    <DnsRecordItem
                        record={domainResult.dnsInstructions.txtRecord}
                    />
                ),
            },
        ];
    }, [domainResult, messages]);

    return (
        <>
            {/* Divider */}
            <div className="relative mb-4 flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <span
                    className="relative px-4 text-xs uppercase tracking-wider text-zinc-400"
                    style={{
                        background: token.colorBgContainer,
                    }}
                >
                    {messages('tenant.customDomain.orAddManually')}
                </span>
            </div>

            {/* Manual setup alert instructions */}
            <Alert
                type="info"
                showIcon
                message={messages('tenant.customDomain.dnsTitle')}
                description={messages('tenant.customDomain.dnsDescription')}
                className="mb-4"
            />

            <Descriptions
                bordered
                column={1}
                items={dnsInstructionsItems}
            />
        </>
    );
}
