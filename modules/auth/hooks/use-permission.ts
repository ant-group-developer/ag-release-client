import { APP_ROUTES } from '@/enums/routes';
import { flattenData } from '@/helpers/common';
import { usePermission } from '@/hooks/use-permission';
import { adminRoutes, RouteNode, RouteRequired } from '@/layouts/cms-layout/routes';
import { checkIsSystemAdmin } from '@/modules/user/utils/role';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { UserInfoData } from '../types/auth';
import { useAuth } from './use-auth';

export const useCheckPermission = () => {
    const { profile } = useAuth();

    const pathname = usePathname();
    const locale = useLocale();
    const { hasPermission } = usePermission();

    const checkPermission = (
        required?: RouteRequired,
        customProfile?: UserInfoData
    ) => {
        const targetProfile = customProfile || profile;
        if (required === undefined) return true;

        if ('userType' in required) {
            const { userType, tenantId } = required;
            return (
                userType.some((item) => item === targetProfile.type) &&
                tenantId.some((item) => item === targetProfile.tenantId)
            );
        }

        if ('tenantType' in required) {
            return required.tenantType.some(
                (item) => item === targetProfile.tenantType
            );
        }

        if ('tenantUserType' in required) {
            return required.tenantUserType.some(
                (item) => item === targetProfile.tenantUserType
            );
        }

        if (checkIsSystemAdmin(targetProfile.type)) return true;

        if (customProfile) {
            const userPerms = new Set(targetProfile.permission || []);
            return required.permission.some((perm) => userPerms.has(perm));
        }

        return hasPermission(required.permission);
    };

    const convertHref = (value: string) => '/' + locale + value;
    const isForbiddenPage = convertHref(APP_ROUTES.FORBIDDEN);

    // --- helpers for robust path matching (supports '*' suffix wildcards) ---
    const normalize = (p: string) =>
        p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;

    const patternMatchesPath = (pattern: string, path: string) => {
        const pat = normalize(pattern);
        const pth = normalize(path);

        // exact match (no wildcard)
        if (!pat.includes('*')) return pat === pth;

        // wildcard: '/vi/artists/*' => match '/vi/artists' OR any subpath
        const prefix = normalize(pat.replace(/\*+$/, ''));
        return pth === prefix || pth.startsWith(`${prefix}/`);
    };

    function checkCanAccessCurrentRoute() {
        const flattenRoutes = flattenData(adminRoutes, {});

        // Build list of candidate matches, then pick the most specific
        const candidates = flattenRoutes
            .map((item) => ({ item, pattern: convertHref(item.href) }))
            .filter(({ pattern }) => patternMatchesPath(pattern, pathname))
            .sort((a, b) => {
                const aExact = !a.pattern.includes('*');
                const bExact = !b.pattern.includes('*');

                // exact matches before wildcard matches
                if (aExact !== bExact) return aExact ? -1 : 1;

                // among wildcards, prefer the longest (most specific) prefix
                const aPrefixLen = normalize(
                    a.pattern.replace(/\*+$/, '')
                ).length;
                const bPrefixLen = normalize(
                    b.pattern.replace(/\*+$/, '')
                ).length;
                return bPrefixLen - aPrefixLen;
            });

        const route = candidates[0]?.item;

        if (!route) return false;
        return checkPermission(route.required);
    }

    function getFirstAccessibleRoute(customProfile?: UserInfoData) {
        const flattenRoutes = flattenData(adminRoutes, {}) as RouteNode[];

        // 1. Check if user can access Dashboard
        const dashboardRoute = flattenRoutes.find(
            (item) => item.type === 'link' && item.href === APP_ROUTES.DASHBOARD
        );
        if (
            dashboardRoute &&
            !dashboardRoute.hidden &&
            checkPermission(dashboardRoute.required, customProfile)
        ) {
            return APP_ROUTES.DASHBOARD;
        }

        // 2. Find the first non-hidden route accessible via read permission
        const firstAccessible = flattenRoutes.find(
            (item) =>
                item.type === 'link' &&
                !item.hidden &&
                checkPermission(item.required, customProfile)
        );

        if (
            firstAccessible &&
            'href' in firstAccessible &&
            firstAccessible.href
        ) {
            return firstAccessible.href;
        }

        // 3. Fallback to forbidden route if no route is accessible
        return APP_ROUTES.FORBIDDEN;
    }

    return {
        isForbiddenPage,
        checkCanAccessCurrentRoute,
        checkPermission,
        getFirstAccessibleRoute,
    };
};
