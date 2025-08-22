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
        if (isLoading) return true;

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

    return {
        isLoading,
        isForbiddenPage,
        checkCanAccessCurrentRoute,
        checkPermission,
    };
};
