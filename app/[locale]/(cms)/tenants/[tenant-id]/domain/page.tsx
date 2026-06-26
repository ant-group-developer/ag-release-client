'use client';

import TenantDomainModule from '@/modules/tenant-domain/components/tenant-domain-module';
import { Suspense } from 'react';
import { Skeleton } from 'antd';
import { useParams } from 'next/navigation';

function TenantDomainPage() {
    const params = useParams();
    const tenantId = params['tenant-id'] as string;

    return (
        <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
            <TenantDomainModule tenantId={tenantId} />
        </Suspense>
    );
}

export default TenantDomainPage;
