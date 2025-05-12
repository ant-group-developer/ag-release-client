import { APP_ROUTES } from '@/enums/routes';
import { flattenData } from '@/helpers/common';
import { adminRoutes, AdminRoutesChildType } from '@/layouts/cms-layout/routes';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useAuth } from './use-auth';

export const usePermission = () => {
    const { permission, isAdmin, isLoading } = useAuth();
    const pathname = usePathname();
    const locale = useLocale();

    const checkPermission = (name: string) => {
        if (isAdmin) return true;
        return permission.includes(name);
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
        return checkPermission(route?.permission);
    }

    function findRouteCanAccess() {
        const flattenRoutes = flattenData(adminRoutes, {});
        const route: AdminRoutesChildType | undefined = flattenRoutes.find(
            (item) => checkPermission(item.permission) && !item.children
        );
        return route;
    }

    function getPermission() {
        const canAccessCurrentRoute = checkCanAccessCurrentRoute();
        const routeCanAccess = findRouteCanAccess();
        return { canAccessCurrentRoute, routeCanAccess };
    }

    return {
        isLoading,
        isForbiddenPage,
        getPermission,
        checkPermission,
    };
};
