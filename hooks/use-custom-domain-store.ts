import { create } from 'zustand';

export interface CustomDomainTenant {
    tenantId: string;
    name: string;
    title: string | null;
    logo: string | null;
    primaryColor: string | null;
}

type CustomDomainStore = {
    isPrimaryDomain: boolean | null;
    domain: string | null;
    tenant: CustomDomainTenant | null;
    resolved: boolean;
    setResolved: (data: {
        isPrimaryDomain: boolean;
        domain: string;
        tenant: CustomDomainTenant | null;
    }) => void;
};

export const useCustomDomainStore = create<CustomDomainStore>((set) => ({
    isPrimaryDomain: null,
    domain: null,
    tenant: null,
    resolved: false,
    setResolved: ({ isPrimaryDomain, domain, tenant }) =>
        set({ isPrimaryDomain, domain, tenant, resolved: true }),
}));
