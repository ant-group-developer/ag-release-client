import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
import {
    Box,
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
    Speaker,
    SquareActivity,
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
                id: 'release-type',
                label: 'releaseType.label',
                href: APP_ROUTES.RELEASE_TYPE,
                icon: Contact,
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
                label: 'user.permission',
                href: APP_ROUTES.PERMISSION,
                icon: LockKeyhole,
                title: 'Permission',
                permission: PERMISSION.PERMISSION.UPDATE,
            },
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
                title: 'tenant',
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
        ],
    },
];
