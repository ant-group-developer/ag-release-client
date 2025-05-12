'use client';

import { useRouter } from '@/i18n/routing';
import Forbidden from '@/modules/auth/components/forbidden';
import { usePermission } from '@/modules/auth/hooks/use-permission';
import { useEffect } from 'react';

type Props = {};

function ForbiddenPage({}: Props) {
    const router = useRouter();
    const { getPermission, isLoading } = usePermission();
    const { routeCanAccess } = getPermission();

    useEffect(() => {
        function verify() {
            if (isLoading) return;

            if (routeCanAccess) {
                return router.push(routeCanAccess.href);
            }
        }

        verify();
    }, [isLoading, routeCanAccess, router]);

    return <Forbidden />;
}

export default ForbiddenPage;
