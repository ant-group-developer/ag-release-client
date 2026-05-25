import { useAuth } from '@/modules/auth/hooks/use-auth';
import usePermissionStore from './use-permission-store';

export type Requirement =
    | string
    | string[]
    | { allOf: string[] }
    | { anyOf: string[] };

const isAllOf = (x: Requirement): x is { allOf: string[] } =>
    typeof x === 'object' && !Array.isArray(x) && 'allOf' in x;

const isAnyOf = (x: Requirement): x is { anyOf: string[] } =>
    typeof x === 'object' && !Array.isArray(x) && 'anyOf' in x;

export const usePermission = () => {
    const data = usePermissionStore((state) => state.permission);
    const { isAdmin, isTenantOwnerOrAdmin, permission } = useAuth();

    const check = (req: string): boolean => data.has(req);

    const hasPermission = (requirement: Requirement): boolean => {
        // if (isAdmin || isTenantOwnerOrAdmin) {
        //     return true;
        // }

        if (isAdmin) {
            return true;
        }

        if (typeof requirement === 'string') return check(requirement);

        if (Array.isArray(requirement)) {
            // default to anyOf
            return requirement.some(check);
        }

        if (isAllOf(requirement) && requirement.allOf.length > 0) {
            return requirement.allOf.every(check);
        }

        if (isAnyOf(requirement) && requirement.anyOf.length > 0) {
            return requirement.anyOf.some(check);
        }

        return true;
    };

    const hasAnyPermission = (requirements: Requirement[]): boolean => {
        if (isAdmin) return true;
        return requirements.some(hasPermission);
    };

    const hasAllPermissions = (requirements: Requirement[]): boolean => {
        if (isAdmin) return true;
        return requirements.every(hasPermission);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAdmin,
        permission,
    };
};
