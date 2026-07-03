import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { SYSTEM_TENANT_ID } from '@/modules/tenant/constants';
import { TENANT_TYPE, TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { USER_TYPE } from '@/modules/user/enums';
import {
    Banknote,
    BellElectric,
    BookA,
    Box,
    Building2,
    ChartNoAxesCombined,
    ChevronsUp,
    CircleAlert,
    CircleDollarSign,
    ClipboardList,
    Clock,
    Contact,
    DiscAlbum,
    Earth,
    FileClock,
    FileMusic,
    FileTerminal,
    FileText,
    FileVolume,
    Flag,
    Globe,
    House,
    Key,
    Layers,
    LayoutList,
    Library,
    LibraryBig,
    ListOrdered,
    LockKeyhole,
    LucideProps,
    Mail,
    MicVocal,
    Music,
    Newspaper,
    ScrollText,
    Server,
    Settings,
    Speaker,
    SquareUser,
    Trash,
    User,
    User2,
    Video,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Requirements guard for routes
 */
export type RouteRequired =
    | { userType: USER_TYPE[]; tenantId: string[] }
    | { tenantType: TENANT_TYPE[] }
    | { tenantUserType: TENANT_USER_TYPE[] }
    | { permission: string[] };

/** Reusable icon type */
export type IconComponent = ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

/**
 * Recursive route node model that supports unlimited depth.
 * `group` may have an optional `href` (clickable group), or only `children`.
 * `link` must have `href`.
 */
type BaseNode = {
    id: string;
    label: string; // i18n key
    title?: string;
    icon?: IconComponent;
    required?: RouteRequired;
    hidden?: boolean;
    external?: boolean;
};

export type RouteLinkNode = BaseNode & {
    type: 'link';
    href: APP_ROUTES | string;
};

export type RouteGroupNode = BaseNode & {
    type: 'group';
    children: RouteNode[];
    href?: APP_ROUTES | string; // optional: clickable group label
};

export type RouteNode = RouteLinkNode | RouteGroupNode;

/** DRY helpers for repeated requirements */
const SYS_ADMIN_REQ: RouteRequired = {
    userType: [USER_TYPE.ADMIN],
    tenantId: [SYSTEM_TENANT_ID],
};

export enum ROUTES_ID {
    SYSTEM = 'system',
    GENERAL = 'general',
    LOGS = 'logs',
}

/**
 * Top-level admin routes (all entries here are groups by convention).
 * You can nest `group` inside `group` as deeply as you like.
 */
export const adminRoutes: RouteNode[] = [
    {
        id: 'management',
        type: 'group',
        label: 'common.management',
        children: [
            {
                id: 'bulk-upload-demo',
                type: 'link',
                label: 'Bulk Upload Demo',
                title: 'Bulk Upload Demo',
                href: '/bulk-upload-demo',
                icon: House,
                required: { permission: [PERMISSION.DASHBOARD.READ] },
                hidden: true,
            },
            {
                id: 'dashboard',
                type: 'link',
                label: 'dashboard.label',
                title: 'Dashboard',
                href: APP_ROUTES.DASHBOARD,
                icon: House,
                required: { permission: [PERMISSION.DASHBOARD.READ] },
            },
            {
                id: 'analytics',
                type: 'link',
                label: 'analytics.label',
                title: 'Analytics',
                href: APP_ROUTES.ANALYTICS,
                icon: ChartNoAxesCombined,
                required: { permission: [PERMISSION.ANALYTICS.READ] },
            },
            {
                id: 'analyticsDetail',
                type: 'link',
                label: 'analytics.label',
                title: 'Analytics Detail',
                hidden: true,
                href: APP_ROUTES.ANALYTICS_DETAIL,
                icon: ChartNoAxesCombined,
                required: { permission: [PERMISSION.ANALYTICS.READ] },
            },
            {
                id: 'release',
                type: 'link',
                label: 'release.routeLabel',
                title: 'Releases',
                href: APP_ROUTES.RELEASES,
                icon: DiscAlbum,
                required: { permission: [PERMISSION.RELEASE_AUDIO.READ] },
            },
            {
                id: 'release-distribution',
                type: 'link',
                label: 'release.releaseDistributionRouteLabel',
                title: 'Release Distribution',
                href: APP_ROUTES.RELEASE_DISTRIBUTION,
                icon: Globe,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'releaseDistributionDetail',
                type: 'link',
                label: 'release.releaseDistributionRouteLabel',
                title: 'Release Distribution Detail',
                hidden: true,
                href: APP_ROUTES.RELEASE_DISTRIBUTION_DETAIL,
                icon: Globe,
                required: SYS_ADMIN_REQ,
            },

            {
                id: 'releaseDetail',
                type: 'link',
                label: 'release.routeLabel',
                title: 'Release Detail',
                href: APP_ROUTES.RELEASES_DETAIL,
                hidden: true,
                icon: DiscAlbum,
                required: {
                    permission: [
                        PERMISSION.RELEASE_AUDIO.READ,
                        PERMISSION.RELEASE_AUDIO.CREATE,
                    ],
                },
            },
            {
                id: 'release-videos',
                type: 'link',
                label: 'releaseVideo.routeLabel',
                title: 'Release Videos',
                href: APP_ROUTES.RELEASE_VIDEOS,
                icon: Video,
                required: {
                    permission: [
                        PERMISSION.RELEASE_VIDEO.READ,
                        PERMISSION.RELEASE_VIDEO.CREATE,
                    ],
                },
            },
            {
                id: 'releaseVideosDetail',
                type: 'link',
                label: 'releaseVideo.routeLabel',
                title: 'Release Video Detail',
                href: APP_ROUTES.RELEASE_VIDEOS_DETAIL,
                hidden: true,
                icon: Video,
                required: {
                    permission: [
                        PERMISSION.RELEASE_VIDEO.READ,
                        PERMISSION.RELEASE_VIDEO.CREATE,
                    ],
                },
            },
            {
                id: 'track',
                type: 'link',
                label: 'track.label',
                title: 'Tracks',
                href: APP_ROUTES.TRACKS,
                icon: Music,
                required: { permission: [PERMISSION.TRACK.READ] },
            },
            {
                id: 'trackDetail',
                type: 'link',
                label: 'release.label',
                title: 'Track Detail',
                href: APP_ROUTES.TRACK_DETAIL,
                hidden: true,
                icon: Music,
                required: { permission: [PERMISSION.TRACK.READ] },
            },
            {
                id: 'distribution',
                type: 'link',
                label: 'distribution.label',
                title: 'Distribution',
                href: APP_ROUTES.DISTRIBUTION,
                icon: Box,
                hidden: true,
                required: {
                    permission: [PERMISSION.RELEASE_AUDIO.UPDATE],
                },
            },
            // {
            //     id: 'revenue',
            //     type: 'link',
            //     label: 'common.revenue',
            //     title: 'Revenue',
            //     href: APP_ROUTES.REVENUE,
            //     icon: ClipboardList,
            //     required: { permission: [PERMISSION.REVENUE.READ] },
            // },
        ],
    },
    {
        id: 'category',
        type: 'group',
        label: 'common.categories',
        children: [
            {
                id: 'artists',
                type: 'link',
                label: 'artist.label',
                title: 'Artists',
                href: APP_ROUTES.ARTISTS,
                icon: User,
                required: { permission: [PERMISSION.ARTIST.READ] },
            },
            {
                id: 'artistDetail',
                type: 'link',
                label: 'artist.label',
                title: 'Artist Detail',
                href: APP_ROUTES.ARTIST_DETAIL,
                hidden: true,
                icon: User,
                required: { permission: [PERMISSION.ARTIST.READ] },
            },
            {
                id: 'labels',
                type: 'link',
                label: 'label.label',
                title: 'Labels',
                href: APP_ROUTES.LABELS,
                icon: MicVocal,
                required: { permission: [PERMISSION.LABEL.READ] },
            },
            {
                id: 'labelDetail',
                type: 'link',
                label: 'labels.label',
                title: 'Label Detail',
                href: APP_ROUTES.LABEL_DETAIL,
                hidden: true,
                icon: MicVocal,
                required: { permission: [PERMISSION.LABEL.READ] },
            },
            {
                id: 'dsp',
                type: 'link',
                label: 'dsp.label',
                title: 'DSP',
                href: APP_ROUTES.DSP,
                icon: Server,
                required: { permission: [PERMISSION.DSP.READ] },
            },
            {
                id: 'channels',
                type: 'link',
                label: 'channel.label',
                title: 'Channels',
                href: APP_ROUTES.CHANNELS,
                icon: Video,
                required: { permission: [PERMISSION.CHANNEL.READ] },
            },

            // {
            //     id: 'dsp-tenant',
            //     type: 'link',
            //     label: 'dsp.label',
            //     title: 'DSP',
            //     href: APP_ROUTES.DSP_TENANT,
            //     icon: SquareActivity,
            //     required: { permission: [PERMISSION.DSP_TENANT.READ] },
            // },
        ],
    },
    {
        id: 'issues',
        type: 'group',
        label: 'issueCategory.label',
        children: [
            {
                id: 'tenant-issue',
                type: 'link',
                label: 'tenantIssue.label',
                title: 'Partner issue',
                href: APP_ROUTES.TENANT_ISSUE,
                icon: Flag,
                required: { permission: [PERMISSION.TENANT_ISSUE.READ] },
            },
            {
                id: 'tenant-tier',
                type: 'link',
                label: 'tenantTier.label',
                title: 'Partner tier',
                href: APP_ROUTES.TENANT_TIERS,
                icon: ChevronsUp,
                required: { permission: [PERMISSION.TENANT_TIER.READ] },
            },
            {
                id: 'issues',
                type: 'link',
                label: 'common.issues',
                title: 'Issues',
                href: APP_ROUTES.ISSUES,
                icon: CircleAlert,
                required: { permission: [PERMISSION.ISSUE.READ] },
            },
            {
                id: 'issue-level',
                type: 'link',
                label: 'issueLevel.label',
                title: 'Issue level',
                href: APP_ROUTES.ISSUE_LEVEL,
                icon: ListOrdered,
                required: { permission: [PERMISSION.ISSUE.READ] },
            },
        ],
    },
    {
        id: 'news',
        type: 'group',
        label: 'news.label',
        children: [
            {
                id: 'newsCategory',
                type: 'link',
                label: 'newsCategory.label',
                title: 'News category',
                href: APP_ROUTES.NEWS_CATEGORY,
                icon: LibraryBig,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'newsPost',
                type: 'link',
                label: 'newsPost.label',
                title: 'News post',
                href: APP_ROUTES.NEWS,
                icon: Newspaper,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'newsPost',
                type: 'link',
                label: 'newsPost.label',
                title: 'News post',
                hidden: true,
                href: APP_ROUTES.NEWS_DETAIL,
                icon: Newspaper,
                required: SYS_ADMIN_REQ,
            },
        ],
    },
    {
        id: ROUTES_ID.LOGS,
        type: 'group',
        label: 'common.logs',
        children: [
            {
                id: 'batch-import',
                type: 'link',
                label: 'batchImport.label',
                title: 'Batch Import',
                href: APP_ROUTES.BATCH_IMPORT,
                icon: ClipboardList,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'release-log',
                type: 'link',
                label: 'releaseLog.label',
                title: 'Release Log',
                href: APP_ROUTES.RELEASE_LOG,
                icon: ScrollText,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'log',
                type: 'link',
                label: 'log.label',
                title: 'Log',
                href: APP_ROUTES.LOG,
                icon: FileClock,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'release-executions',
                type: 'link',
                label: 'releaseExecution.labelOld',
                title: 'Release Executions',
                href: APP_ROUTES.RELEASE_EXECUTIONS,
                icon: Trash,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'release-submits',
                type: 'link',
                label: 'releaseExecution.label',
                title: 'Release Submits',
                href: APP_ROUTES.RELEASE_SUBMITS,
                icon: FileTerminal,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'distribution-jobs',
                type: 'link',
                label: 'distributionJobs.label',
                title: 'Distribution Jobs',
                href: APP_ROUTES.DISTRIBUTION_JOBS,
                icon: ClipboardList,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'dsp-report',
                type: 'link',
                label: 'dspReport.label',
                title: 'DSP Reports',
                href: APP_ROUTES.DSP_REPORT,
                icon: ScrollText,
                required: SYS_ADMIN_REQ,
            },
        ],
    },
    {
        id: ROUTES_ID.SYSTEM,
        type: 'group',
        label: 'common.system',
        children: [
            {
                id: 'ping',
                type: 'link',
                label: 'Ping',
                title: 'Ping',
                href: APP_ROUTES.PING,
                icon: LockKeyhole,
                hidden: true,
            },
            {
                id: 'permission',
                type: 'link',
                label: 'permission.label',
                title: 'Permission',
                href: APP_ROUTES.PERMISSION,
                icon: LockKeyhole,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'roles',
                type: 'link',
                label: 'roles.label',
                title: 'Roles',
                href: APP_ROUTES.ROLES,
                icon: SquareUser,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'user',
                type: 'link',
                label: 'user.label',
                title: 'Users',
                href: APP_ROUTES.USER,
                icon: User2,
                required: { permission: [PERMISSION.USER.READ] },
            },
            {
                id: 'tenant',
                type: 'link',
                label: 'tenant.label',
                title: 'Workspace',
                href: APP_ROUTES.TENANT,
                icon: Layers,
                required: { permission: [PERMISSION.WORKSPACE.READ] },
            },
            {
                id: 'aggregator',
                type: 'link',
                label: 'aggregator.label',
                title: 'Aggregator',
                href: APP_ROUTES.AGGREGATOR,
                icon: Building2,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'tenantDetail',
                type: 'link',
                label: 'tenant.label',
                title: 'Workspace Detail',
                href: APP_ROUTES.TENANT_DETAIL,
                hidden: true,
                icon: Layers,
                required: { permission: [PERMISSION.WORKSPACE.READ] },
            },
            {
                id: 'email-sender',
                type: 'link',
                label: 'emailSender.label',
                title: 'Email Sender',
                href: APP_ROUTES.EMAIL_SENDER,
                icon: Mail,
                required: SYS_ADMIN_REQ,
                hidden: true,
            },
            {
                id: 'setting',
                type: 'link',
                label: 'setting.label',
                title: 'Setting',
                href: APP_ROUTES.SETTING,
                icon: Settings,
                required: SYS_ADMIN_REQ,
            },
            {
                id: 'youtube-keys',
                type: 'link',
                label: 'youtubeKeys.label',
                title: 'Youtube Keys',
                href: APP_ROUTES.YOUTUBE_KEYS,
                icon: Key,
                required: SYS_ADMIN_REQ,
            },
            {
                id: ROUTES_ID.GENERAL,
                type: 'group',
                label: 'common.general',
                title: 'General',
                icon: LayoutList,
                required: SYS_ADMIN_REQ,
                children: [
                    {
                        id: 'report-import',
                        type: 'link',
                        label: 'reportConfigs.label',
                        title: 'Report Import',
                        href: APP_ROUTES.REPORT_IMPORT,
                        icon: FileText,
                        required: SYS_ADMIN_REQ,
                    },
                    // {
                    //     id: 'deal-type',
                    //     type: 'link',
                    //     label: 'dealType.label',
                    //     title: 'Deal Type',
                    //     href: APP_ROUTES.DEAL_TYPE,
                    //     icon: ScrollText,
                    //     required: SYS_ADMIN_REQ,
                    //     hidden: true,
                    // },
                    {
                        id: 'genres',
                        type: 'link',
                        label: 'genre.label',
                        title: 'Genres',
                        href: APP_ROUTES.GENRES,
                        icon: Library,
                        required: SYS_ADMIN_REQ,
                    },

                    {
                        id: 'currencies',
                        type: 'link',
                        label: 'currencies.label',
                        title: 'Currencies',
                        href: APP_ROUTES.CURRENCIES,
                        icon: Banknote,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'priceTiers',
                        type: 'link',
                        label: 'price.label',
                        title: 'Price Tiers',
                        href: APP_ROUTES.PRICE_TIERS,
                        icon: CircleDollarSign,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'policy',
                        type: 'link',
                        label: 'policy.label',
                        title: 'Policy',
                        href: APP_ROUTES.ACTIONS,
                        icon: BookA,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'release-type',
                        type: 'link',
                        label: 'releaseType.label',
                        title: 'Release Type',
                        href: APP_ROUTES.RELEASE_TYPE,
                        icon: BellElectric,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'artist-role',
                        type: 'link',
                        label: 'artist.role',
                        title: 'Artist Role',
                        href: APP_ROUTES.ARTIST_ROLE,
                        icon: Contact,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'track-types',
                        type: 'link',
                        label: 'trackType.label',
                        title: 'Track Type',
                        href: APP_ROUTES.TRACK_TYPE,
                        icon: Speaker,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'track-origin-types',
                        type: 'link',
                        label: 'trackOriginType.label',
                        title: 'Track Origin',
                        href: APP_ROUTES.TRACK_ORIGIN_TYPE,
                        icon: FileMusic,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'track-sensitive',
                        type: 'link',
                        label: 'trackSensitive.label',
                        title: 'Track sensitive',
                        href: APP_ROUTES.TRACK_SENSITIVE,
                        icon: FileVolume,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'languages',
                        type: 'link',
                        label: 'common.language',
                        title: 'Languages',
                        href: APP_ROUTES.LANGUAGES,
                        icon: Globe,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'countries',
                        type: 'link',
                        label: 'country.label',
                        title: 'Countries',
                        href: APP_ROUTES.COUNTRIES,
                        icon: Earth,
                        required: SYS_ADMIN_REQ,
                    },
                    {
                        id: 'timezone',
                        type: 'link',
                        label: 'timezone.label',
                        title: 'Timezone',
                        href: APP_ROUTES.TIMEZONE,
                        icon: Clock,
                        required: SYS_ADMIN_REQ,
                    },
                ],
            },
        ],
    },
];
