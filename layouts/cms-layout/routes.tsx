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
    ChartNoAxesCombined,
    ChevronsUp,
    CircleAlert,
    CircleDollarSign,
    Clock,
    Contact,
    DiscAlbum,
    Earth,
    FileMusic,
    FileVolume,
    Flag,
    Globe,
    House,
    Layers,
    LayoutList,
    Library,
    List,
    ListOrdered,
    LockKeyhole,
    LucideProps,
    Mail,
    MicVocal,
    Music,
    Settings,
    Speaker,
    SquareActivity,
    SquareUser,
    User,
    User2,
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

const OWNER_OR_ADMIN_TENANT_REQ: RouteRequired = {
    tenantUserType: [TENANT_USER_TYPE.OWNER, TENANT_USER_TYPE.ADMIN],
};

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
            },
            {
                id: 'analytics',
                type: 'link',
                label: 'analytics.label',
                title: 'Analytic Detail',
                hidden: true,
                href: APP_ROUTES.ANALYTIC_DETAIL,
                icon: ChartNoAxesCombined,
            },
            {
                id: 'release',
                type: 'link',
                label: 'release.label',
                title: 'Releases',
                href: APP_ROUTES.RELEASES,
                icon: DiscAlbum,
                required: { permission: [PERMISSION.RELEASE.READ] },
            },
            {
                id: 'releaseDetail',
                type: 'link',
                label: 'release.label',
                title: 'Release Detail',
                href: APP_ROUTES.RELEASES_DETAIL,
                hidden: true,
                icon: DiscAlbum,
                required: {
                    permission: [
                        PERMISSION.RELEASE.READ,
                        PERMISSION.RELEASE.CREATE,
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
                required: {
                    permission: [PERMISSION.RELEASE.UPDATE],
                },
            },
        ],
    },
    {
        id: 'category',
        type: 'group',
        label: 'common.category',
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
                id: 'labelDetail', // fixed duplicate id
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
                icon: SquareActivity,
                required: { permission: [PERMISSION.DSP.READ] },
            },
        ],
    },
    {
        id: 'issues',
        type: 'group',
        label: 'common.issues',
        children: [
            {
                id: 'issues',
                type: 'link',
                label: 'issue.label',
                title: 'Issues',
                href: APP_ROUTES.ISSUES,
                icon: CircleAlert,
            },
            {
                id: 'issue-level',
                type: 'link',
                label: 'issueLevel.label',
                title: 'Issue level',
                href: APP_ROUTES.ISSUE_LEVEL,
                icon: ListOrdered,
            },
            {
                id: 'issue-category',
                type: 'link',
                label: 'issueCategory.label',
                title: 'Issue category',
                href: '',
                icon: List,
            },
            {
                id: 'tenant-issue',
                type: 'link',
                label: 'tenantIssue.label',
                title: 'Tenant issue',
                href: '',
                icon: Flag,
            },
            {
                id: 'tenant-tier',
                type: 'link',
                label: 'tenantTier.label',
                title: 'Tenant tier',
                href: APP_ROUTES.TENANT_TIERS,
                icon: ChevronsUp,
            },
        ],
    },
    {
        id: 'system',
        type: 'group',
        label: 'common.system',
        children: [
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
                required: OWNER_OR_ADMIN_TENANT_REQ,
            },
            {
                id: 'tenant',
                type: 'link',
                label: 'tenant.label',
                title: 'Tenant',
                href: APP_ROUTES.TENANT,
                icon: Layers,
                required: OWNER_OR_ADMIN_TENANT_REQ,
            },
            {
                id: 'tenantDetail',
                type: 'link',
                label: 'tenant.label',
                title: 'Tenant Detail',
                href: APP_ROUTES.TENANT_DETAIL,
                hidden: true,
                icon: Layers,
                required: OWNER_OR_ADMIN_TENANT_REQ,
            },
            {
                id: 'email-sender',
                type: 'link',
                label: 'emailSender.label',
                title: 'Email Sender',
                href: APP_ROUTES.EMAIL_SENDER,
                icon: Mail,
                required: SYS_ADMIN_REQ,
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
                id: 'general',
                type: 'group',
                label: 'common.general',
                title: 'General',
                icon: LayoutList,
                required: SYS_ADMIN_REQ,
                children: [
                    {
                        id: 'genres',
                        type: 'link',
                        label: 'common.genres',
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
