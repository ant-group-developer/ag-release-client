import { DOMAIN_SSL_STATUS, DOMAIN_STATUS } from '../enums';

export interface DnsRecord {
    type: 'CNAME' | 'TXT';
    name: string;
    value: string;
}

export interface DnsInstructions {
    cnameRecord: DnsRecord;
    txtRecord: DnsRecord;
}

export interface TenantDomainData {
    domain: string;
    status: DOMAIN_STATUS;
    sslStatus: DOMAIN_SSL_STATUS;
    createdAt: string;
    updatedAt: string | null;
}

export interface RegisterDomainResponse {
    domain: TenantDomainData;
    dnsInstructions: DnsInstructions;
}

export interface GetDomainResponse {
    domain: TenantDomainData;
    dnsInstructions: DnsInstructions | null;
}

export interface CfOAuthUrlResponse {
    url: string;
}

export interface DomainResolveTenant {
    tenantId: string;
    name: string;
    title: string | null;
    logo: string | null;
    primaryColor: string | null;
}

export interface DomainResolveResponse {
    isPrimaryDomain: boolean;
    domain: string;
    tenant: DomainResolveTenant | null;
}

