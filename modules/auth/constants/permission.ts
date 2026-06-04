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
    DSP_SYSTEM: {
        CONFIGURE_INTEGRATION: 'dsp_system.configure_integration',
        READ: 'dsp_system.read',
        CREATE: 'dsp_system.create',
        UPDATE: 'dsp_system.update',
        DELETE: 'dsp_system.delete',
        UPDATE_POLICIES: 'dsp_system.update.policies',
        UPDATE_DEALS: 'dsp_system.update.deals',
    },
    DSP_TENANT: {
        READ: 'dsp_tenant.read',
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
        DELETE: 'release.delete',
    },
    RELEASE_VIDEO: {
        REVIEW: 'release_video.review',
        CREATE: 'release_video.create',
        READ: 'release_video.read',
        TAKE_DOWN: 'release_video.take_down',
        UPDATE: 'release_video.update',
        DELETE: 'release_video.delete',
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
        INVITE: 'user.invite',
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
