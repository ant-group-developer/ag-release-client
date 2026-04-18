export const PERMISSION = {
    DASHBOARD: {
        READ: 'dashboard.read',
    },
    ARTIST: {
        CREATE: 'artist.create',
        READ: 'artist.read',
        UPDATE: 'artist.update',
        DELETE: 'artist.delete',
    },
    DSP: {
        CONFIGURE_INTEGRATION: 'dsp.configure_integration',
        READ: 'dsp.read',
        CREATE: 'dsp.create',
        UPDATE: 'dsp.update',
        DELETE: 'dsp.delete',
        UPDATE_POLICIES: 'dsp.update.policies',
        UPDATE_DEALS: 'dsp.update.deals',
    },
    LABEL: {
        CREATE: 'label.create',
        READ: 'label.read',
        UPDATE: 'label.update',
        DELETE: 'label.delete',
    },
    RELEASE: {
        REVIEW: 'release.review',
        CREATE: 'release.create',
        READ: 'release.read',
        TAKE_DOWN: 'release.take_down',
        UPDATE: 'release.update',
    },
    TRACK: {
        READ: 'track.read',
        SCAN: 'track.scan',
    },
    WORKSPACE: {
        CREATE: 'workspace.create',
        READ: 'workspace.read',
        UPDATE: 'workspace.update',
    },
    ISSUE: {
        CREATE: 'issue.create',
        READ: 'issue.read',
        UPDATE: 'issue.update',
        DELETE: 'issue.delete',
    },
    TENANT_ISSUE: {
        READ: 'tenant_issue.read',
        CREATE: 'tenant_issue.create',
        UPDATE: 'tenant_issue.update',
        DELETE: 'tenant_issue.delete',
    },
    TENANT_TIER: {
        READ: 'tenant_tier.read',
        CREATE: 'tenant_tier.create',
        UPDATE: 'tenant_tier.update',
        DELETE: 'tenant_tier.delete',
    },
    USER: {
        READ: 'user.read',
        CREATE: 'user.create',
        UPDATE: 'user.update',
        DELETE: 'user.delete',
    },
    ANALYTICS: {
        READ: 'analytics.read',
    },
    REVENUE: {
        READ: 'revenue.read',
    },
} as const;

// Type helper for permission values
type PermissionModule = (typeof PERMISSION)[keyof typeof PERMISSION];
export type Permission = PermissionModule[keyof PermissionModule];
