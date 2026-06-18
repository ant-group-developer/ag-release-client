import { usePermission } from '@/hooks/use-permission';
import type { ReactNode } from 'react';
import { Permission } from '../constants/permission';

interface PermissionGateProps {
    /** Required permission to show children */
    permission?: Permission | string;
    /** Show children if user has ANY of these permissions */
    anyOf?: (Permission | string)[];
    /** Show children if user has ALL of these permissions */
    allOf?: (Permission | string)[];
    /** Show children only for system admin users */
    adminOnly?: boolean;
    /** Content to show when permission is granted */
    children: ReactNode;
    /** Optional content to show when permission is denied */
    fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 * Admin users bypass all permission checks
 *
 * @example
 * // Single permission
 * <PermissionGate permission={PERMISSIONS.USERS.CREATE}>
 *     <Button>Create User</Button>
 * </PermissionGate>
 *
 * // Any of multiple permissions
 * <PermissionGate anyOf={[PERMISSIONS.USERS.CREATE, PERMISSIONS.USERS.UPDATE]}>
 *     <Button>Edit</Button>
 * </PermissionGate>
 *
 * // With fallback
 * <PermissionGate permission={PERMISSIONS.USERS.DELETE} fallback={<span>No access</span>}>
 *     <Button danger>Delete</Button>
 * </PermissionGate>
 */
export function PermissionGate({
    permission,
    anyOf,
    allOf,
    adminOnly = false,
    children,
    fallback = null,
}: PermissionGateProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } =
        usePermission();

    if (adminOnly) {
        return isAdmin ? <>{children}</> : <>{fallback}</>;
    }

    // Admin always has access
    if (isAdmin) {
        return <>{children}</>;
    }

    // Check single permission
    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    // Check anyOf permissions
    if (anyOf && anyOf.length > 0 && !hasAnyPermission(anyOf)) {
        return <>{fallback}</>;
    }

    // Check allOf permissions
    if (allOf && allOf.length > 0 && !hasAllPermissions(allOf)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
