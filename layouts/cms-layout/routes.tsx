import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
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

export type AdminRoutesChildType = {
    id: string;
    label: any;
    href: APP_ROUTES | string;
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    title: string;
    permission: string;
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
            // {
            //     id: 'release-detail',
            //     label: 'releases.create',
            //     href: APP_ROUTES.CREATE_RELEASE,
            //     icon: Plus,
            //     title: 'release-detail',
            //     permission: PERMISSION.RELEASE.CREATE,
            // },
            {
                id: 'dashboard',
                label: 'dashboard.label',
                href: APP_ROUTES.DASHBOARD,
                icon: House,
                title: 'Dashboard',
                permission: PERMISSION.STATISTIC.READ,
            },
            {
                id: 'releases',
                label: 'releases.label',
                href: APP_ROUTES.RELEASES,
                icon: DiscAlbum,
                title: 'Releases',
                permission: PERMISSION.RELEASE.READ,
            },
            {
                id: 'tracks',
                label: 'tracks.label',
                href: APP_ROUTES.TRACKS,
                icon: Music,
                title: 'Tracks',
                permission: PERMISSION.TRACK.READ,
            },
            {
                id: 'distribution',
                label: 'distribution.label',
                href: APP_ROUTES.DISTRIBUTION,
                icon: Box,
                title: 'Distribution',
                permission: PERMISSION.DISTRIBUTION.READ,
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
                permission: PERMISSION.ARTIST.READ,
            },
            {
                id: 'labels',
                label: 'labels.label',
                href: APP_ROUTES.LABELS,
                icon: MicVocal,
                title: 'Labels',
                permission: PERMISSION.LABEL.READ,
            },
            {
                id: 'genres',
                label: 'common.genres',
                href: APP_ROUTES.GENRES,
                icon: Library,
                title: 'Genres',
                permission: PERMISSION.DISTRIBUTION.READ,
            },

            {
                id: 'dsp',
                label: 'dsp.label',
                href: APP_ROUTES.DSP,
                icon: SquareActivity,
                title: 'Dsp',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
        ],
    },
    {
        id: 'system-category',
        label: 'common.systemCategories',
        children: [
            {
                id: 'currencies',
                label: 'currencies.label',
                href: APP_ROUTES.CURRENCIES,
                icon: Banknote,
                title: 'currencies',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'priceTiers',
                label: 'price.label',
                href: APP_ROUTES.PRICE_TIERS,
                icon: CircleDollarSign,
                title: 'priceTiers',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'actions',
                label: 'actions.label',
                href: APP_ROUTES.ACTIONS,
                icon: BookA,
                title: 'actions',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'release-type',
                label: 'releaseType.label',
                href: APP_ROUTES.RELEASE_TYPE,
                icon: BellElectric,
                title: 'release-type',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'artist-role',
                label: 'artist.role',
                href: APP_ROUTES.ARTIST_ROLE,
                icon: Contact,
                title: 'Artist Role',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'track-types',
                label: 'trackType.label',
                href: APP_ROUTES.TRACK_TYPE,
                icon: Speaker,
                title: 'Track Type',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'track-origin-types',
                label: 'trackOriginType.label',
                href: APP_ROUTES.TRACK_ORIGIN_TYPE,
                icon: FileMusic,
                title: 'Track Origin',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'languages',
                label: 'common.language',
                href: APP_ROUTES.LANGUAGES,
                icon: Globe,
                title: 'Languages',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'countries',
                label: 'country.label',
                href: APP_ROUTES.COUNTRIES,
                icon: Earth,
                title: 'Countries',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'timezone',
                label: 'timezone.label',
                href: APP_ROUTES.TIMEZONE,
                icon: Clock,
                title: 'Timezone',
                permission: PERMISSION.DISTRIBUTION.READ,
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
                permission: PERMISSION.PERMISSION.UPDATE,
            },
            {
                id: 'roles',
                label: 'roles.label',
                href: APP_ROUTES.ROLES,
                icon: SquareUser,
                title: 'Roles',
                permission: PERMISSION.PERMISSION.UPDATE,
            },
            // {
            //     id: 'grantPermission',
            //     label: 'user.grantPermission.label',
            //     href: APP_ROUTES.GRANT_PERMISSION,
            //     icon: UserLock,
            //     title: 'Grant permission',
            //     permission: PERMISSION.PERMISSION.UPDATE,
            // },
            {
                id: 'user',
                label: 'user.label',
                href: APP_ROUTES.USER,
                icon: User2,
                title: 'Users',
                permission: PERMISSION.PERMISSION.UPDATE,
            },
            {
                id: 'tenant',
                label: 'tenant.label',
                href: APP_ROUTES.TENANT,
                icon: Layers,
                title: 'Tenant',
                permission: PERMISSION.PERMISSION.UPDATE,
            },
            // {
            //     id: 'log',
            //     label: 'log.label',
            //     href: APP_ROUTES.LOG,
            //     icon: StickyNote,
            //     title: 'Log',
            //     permission: PERMISSION.LOG.READ,
            // },
            {
                id: 'email-sender',
                label: 'emailSender.label',
                href: APP_ROUTES.EMAIL_SENDER,
                icon: Mail,
                title: 'Email Sender',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'setting',
                label: 'setting.label',
                href: APP_ROUTES.SETTING,
                icon: Settings,
                title: 'Setting',
                permission: PERMISSION.PERMISSION.UPDATE,
            },
        ],
    },
];
