'use client';

import { useCustomDomainStore } from '@/hooks/use-custom-domain-store';
import { useThemeStore } from '@/hooks/use-theme-store';
import { tenantDomainApi } from '@/modules/tenant-domain/apis';
import { PropsWithChildren, useEffect } from 'react';

function CustomDomainProvider({ children }: PropsWithChildren) {
    const setResolved = useCustomDomainStore((s) => s.setResolved);
    const setPrimaryColor = useThemeStore((s) => s.setPrimaryColor);

    useEffect(() => {
        const hostname = window.location.hostname;
        tenantDomainApi.resolveDomain(hostname).then((result) => {
            if (!result) {
                setResolved({ isPrimaryDomain: true, domain: hostname, tenant: null });
                return;
            }
            setResolved({
                isPrimaryDomain: result.isPrimaryDomain,
                domain: result.domain,
                tenant: result.tenant,
            });
            if (!result.isPrimaryDomain && result.tenant?.primaryColor) {
                setPrimaryColor(result.tenant.primaryColor);
            }
        });
    }, []);

    return <>{children}</>;
}

export default CustomDomainProvider;
