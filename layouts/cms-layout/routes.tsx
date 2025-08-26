import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { SYSTEM_TENANT_ID } from '@/modules/tenant/constants';
import { TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { USER_TYPE } from '@/modules/user/enums';
import {
    Banknote,
    BellElectric,
    BookA,
    Box,
    CircleDollarSign,
    Clock,
    Contact,
    DiscAlbum,
    Earth,
    FileMusic,
    Globe,
    House,
    Layers,
    Library,
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
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type RouteRequired =
    | { userType: USER_TYPE[]; tenantId: string[] }
    | { tenantType: TENANT_USER_TYPE[] }
    | { permission: string[] };

export type AdminRoutesChildType = {
    id: string;
    label: any;
    href: APP_ROUTES | string;
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    title: string;
    required?: RouteRequired;
    hidden?: boolean;
    external?: boolean;
};

export type AdminRoutesType = {
    id: string;
    label: any;
    children: AdminRoutesChildType[];
};

export const adminRoutes: AdminRoutesType[] = [
    {
        id: 'management',
        label: 'common.management',
        children: [
            {
                id: 'dashboard',
                label: 'dashboard.label',
                href: APP_ROUTES.DASHBOARD,
                icon: House,
                title: 'Dashboard',
                required: {
                    permission: [PERMISSION.DASHBOARD.READ],
                },
            },
            {
                id: 'releases',
                label: 'releases.label',
                href: APP_ROUTES.RELEASES,
                icon: DiscAlbum,
                title: 'Releases',
                required: {
                    permission: [PERMISSION.RELEASE.READ],
                },
            },
            {
                id: 'releaseDetail',
                label: 'releases.label',
                href: APP_ROUTES.RELEASES_DETAIL,
                icon: DiscAlbum,
                title: 'Release Detail',
                hidden: true,
                required: {
                    permission: [
                        PERMISSION.RELEASE.READ,
                        PERMISSION.RELEASE.CREATE,
                    ],
                },
            },
            {
                id: 'tracks',
                label: 'tracks.label',
                href: APP_ROUTES.TRACKS,
                icon: Music,
                title: 'Tracks',
                required: {
                    permission: [PERMISSION.TRACK.READ],
                },
            },
            {
                id: 'trackDetail',
                label: 'releases.label',
                href: APP_ROUTES.TRACK_DETAIL,
                icon: Music,
                title: 'Track Detail',
                hidden: true,
                required: {
                    permission: [PERMISSION.TRACK.READ],
                },
            },
            {
                id: 'distribution',
                label: 'distribution.label',
                href: APP_ROUTES.DISTRIBUTION,
                icon: Box,
                title: 'Distribution',
                required: {
                    permission: [
                        PERMISSION.RELEASE.PUBLISH,
                        PERMISSION.RELEASE.UNPUBLISH,
                    ],
                },
            },
        ],
    },
    {
        id: 'general',
        label: 'common.general',
        children: [
            {
                id: 'artists',
                label: 'artist.label',
                href: APP_ROUTES.ARTISTS,
                icon: User,
                title: 'Artists',
                required: {
                    permission: [PERMISSION.ARTIST.READ],
                },
            },
            {
                id: 'artistDetail',
                label: 'artist.label',
                href: APP_ROUTES.ARTIST_DETAIL,
                icon: User,
                title: 'Artist Detail',
                hidden: true,
                required: {
                    permission: [PERMISSION.ARTIST.READ],
                },
            },
            {
                id: 'labels',
                label: 'labels.label',
                href: APP_ROUTES.LABELS,
                icon: MicVocal,
                title: 'Labels',
                required: {
                    permission: [PERMISSION.LABEL.READ],
                },
            },
            {
                id: 'labels',
                label: 'labels.label',
                href: APP_ROUTES.LABEL_DETAIL,
                icon: MicVocal,
                title: 'Label Detail',
                hidden: true,
                required: {
                    permission: [PERMISSION.LABEL.READ],
                },
            },
            {
                id: 'dsp',
                label: 'dsp.label',
                href: APP_ROUTES.DSP,
                icon: SquareActivity,
                title: 'Dsp',
                required: {
                    permission: [PERMISSION.DSP.READ],
                },
            },
        ],
    },
    {
        id: 'system-category',
        label: 'common.systemCategories',
        children: [
            {
                id: 'genres',
                label: 'common.genres',
                href: APP_ROUTES.GENRES,
                icon: Library,
                title: 'Genres',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'currencies',
                label: 'currencies.label',
                href: APP_ROUTES.CURRENCIES,
                icon: Banknote,
                title: 'currencies',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'priceTiers',
                label: 'price.label',
                href: APP_ROUTES.PRICE_TIERS,
                icon: CircleDollarSign,
                title: 'priceTiers',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'actions',
                label: 'policy.label',
                href: APP_ROUTES.ACTIONS,
                icon: BookA,
                title: 'Policy',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'release-type',
                label: 'releaseType.label',
                href: APP_ROUTES.RELEASE_TYPE,
                icon: BellElectric,
                title: 'release-type',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'artist-role',
                label: 'artist.role',
                href: APP_ROUTES.ARTIST_ROLE,
                icon: Contact,
                title: 'Artist Role',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'track-types',
                label: 'trackType.label',
                href: APP_ROUTES.TRACK_TYPE,
                icon: Speaker,
                title: 'Track Type',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'track-origin-types',
                label: 'trackOriginType.label',
                href: APP_ROUTES.TRACK_ORIGIN_TYPE,
                icon: FileMusic,
                title: 'Track Origin',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'languages',
                label: 'common.language',
                href: APP_ROUTES.LANGUAGES,
                icon: Globe,
                title: 'Languages',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'countries',
                label: 'country.label',
                href: APP_ROUTES.COUNTRIES,
                icon: Earth,
                title: 'Countries',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'timezone',
                label: 'timezone.label',
                href: APP_ROUTES.TIMEZONE,
                icon: Clock,
                title: 'Timezone',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
        ],
    },
    {
        id: 'system',
        label: 'common.system',
        children: [
            {
                id: 'permission',
                label: 'permission.label',
                href: APP_ROUTES.PERMISSION,
                icon: LockKeyhole,
                title: 'Permission',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'roles',
                label: 'roles.label',
                href: APP_ROUTES.ROLES,
                icon: SquareUser,
                title: 'Roles',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            // {
            //     id: 'grantPermission',
            //     label: 'user.grantPermission.label',
            //     href: APP_ROUTES.GRANT_PERMISSION,
            //     icon: UserLock,
            //     title: 'Grant permission',
            //     required: PERMISSION.PERMISSION.UPDATE,
            // },
            {
                id: 'user',
                label: 'user.label',
                href: APP_ROUTES.USER,
                icon: User2,
                title: 'Users',
                required: {
                    tenantType: [
                        TENANT_USER_TYPE.OWNER,
                        TENANT_USER_TYPE.ADMIN,
                    ],
                },
            },
            {
                id: 'tenant',
                label: 'tenant.label',
                href: APP_ROUTES.TENANT,
                icon: Layers,
                title: 'Tenant',
                required: {
                    tenantType: [
                        TENANT_USER_TYPE.OWNER,
                        TENANT_USER_TYPE.ADMIN,
                    ],
                },
            },
            {
                id: 'tenantDetail',
                label: 'tenant.label',
                href: APP_ROUTES.TENANT_DETAIL,
                icon: Layers,
                title: 'Tenant Detail',
                hidden: true,
                required: {
                    tenantType: [
                        TENANT_USER_TYPE.OWNER,
                        TENANT_USER_TYPE.ADMIN,
                    ],
                },
            },
            // {
            //     id: 'log',
            //     label: 'log.label',
            //     href: APP_ROUTES.LOG,
            //     icon: StickyNote,
            //     title: 'Log',
            //     required: PERMISSION.LOG.READ,
            // },
            {
                id: 'email-sender',
                label: 'emailSender.label',
                href: APP_ROUTES.EMAIL_SENDER,
                icon: Mail,
                title: 'Email Sender',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
            {
                id: 'setting',
                label: 'setting.label',
                href: APP_ROUTES.SETTING,
                icon: Settings,
                title: 'Setting',
                required: {
                    userType: [USER_TYPE.ADMIN],
                    tenantId: [SYSTEM_TENANT_ID],
                },
            },
        ],
    },
];
