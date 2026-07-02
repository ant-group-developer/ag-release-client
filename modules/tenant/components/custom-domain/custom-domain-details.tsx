import CopyText from '@/components/ui/copy-text/copy-text';
import {
    TENANT_DOMAIN_SSL_STATUS,
    TENANT_DOMAIN_STATUS,
    TenantDomainResponse,
} from '@/modules/tenant/types/data';
import { LoadingOutlined } from '@ant-design/icons';
import { Descriptions, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface StatusDisplay {
    color: string;
    text: string;
    showSpinner?: boolean;
}

const getStatusDisplay = (
    status: TENANT_DOMAIN_STATUS,
    sslStatus: TENANT_DOMAIN_SSL_STATUS,
    messages: any
): StatusDisplay => {
    if (
        status === TENANT_DOMAIN_STATUS.ACTIVE &&
        sslStatus === TENANT_DOMAIN_SSL_STATUS.ACTIVE
    ) {
        return {
            color: 'green',
            text: messages('tenant.customDomain.statuses.active'),
        };
    }
    if (
        status === TENANT_DOMAIN_STATUS.VERIFYING &&
        sslStatus === TENANT_DOMAIN_SSL_STATUS.INITIALIZING
    ) {
        return {
            color: 'processing',
            text: messages('tenant.customDomain.statuses.verifying'),
            showSpinner: true,
        };
    }
    if (
        status === TENANT_DOMAIN_STATUS.FAILED &&
        sslStatus === TENANT_DOMAIN_SSL_STATUS.PENDING
    ) {
        return {
            color: 'red',
            text: messages('tenant.customDomain.statuses.failed'),
        };
    }
    if (status === TENANT_DOMAIN_STATUS.EXPIRED) {
        return {
            color: 'warning',
            text: messages('tenant.customDomain.statuses.expired'),
        };
    }
    // Mặc định cho pending/pending
    return {
        color: 'gold',
        text: messages('tenant.customDomain.statuses.pending'),
    };
};

interface CustomDomainDetailsProps {
    domainResult: TenantDomainResponse;
    isDomainActive: boolean;
}

export default function CustomDomainDetails({
    domainResult,
    isDomainActive,
}: CustomDomainDetailsProps) {
    const messages = useTranslations();

    const domainDetailsItems = useMemo(() => {
        if (!domainResult) return [];
        const statusDisplay = getStatusDisplay(
            domainResult.domain.status,
            domainResult.domain.sslStatus,
            messages
        );

        return [
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
                        color={statusDisplay.color}
                        icon={
                            statusDisplay.showSpinner ? (
                                <LoadingOutlined spin />
                            ) : undefined
                        }
                    >
                        {statusDisplay.text}
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
                                      domainResult.domain.verificationToken ??
                                      ''
                                  }
                              >
                                  {domainResult.domain.verificationToken ??
                                      messages('common.notAvailable')}
                              </CopyText>
                          ),
                      },
                  ]
                : []),
        ];
    }, [domainResult, isDomainActive, messages]);

    return (
        <Descriptions
            bordered
            column={{ xs: 1, md: 2 }}
            items={domainDetailsItems}
        />
    );
}
