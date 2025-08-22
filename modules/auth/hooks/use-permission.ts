import { APP_ROUTES } from '@/enums/routes';
import { flattenData } from '@/helpers/common';
import { usePermission } from '@/hooks/use-permission';
import { adminRoutes, RouteRequired } from '@/layouts/cms-layout/routes';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useAuth } from './use-auth';

export const useCheckPermission = () => {
    const { isLoading, profile } = useAuth();

    const pathname = usePathname();
    const locale = useLocale();
    const { hasPermission } = usePermission();

    const checkPermission = (required?: RouteRequired) => {
        if (required === undefined) return true;

        if ('userType' in required) {
            const { userType, tenantId } = required;
            return (
                userType.some((item) => item === profile.type) &&
                tenantId.some((item) => item === profile.tenantId)
            );
        }

        if ('tenantType' in required) {
            return required.tenantType.some(
                (item) => item === profile.tenantType
            );
        }

        return hasPermission(required.permission);
    };

    const convertHref = (value: string) => '/' + locale + value;
    const isForbiddenPage = convertHref(APP_ROUTES.FORBIDDEN);

    function checkCanAccessCurrentRoute() {
        if (isLoading) {
            return true;
        }

        const flattenRoutes = flattenData(adminRoutes, {});
        const route = flattenRoutes.find(
            (item) => convertHref(item.href) === pathname
        );

        if (!route) return false;
        return checkPermission(route?.required);
    }

    return {
        isLoading,
        isForbiddenPage,
        checkCanAccessCurrentRoute,
        checkPermission,
    };
};
