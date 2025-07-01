import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
import {
    Box,
    Contact,
    DiscAlbum,
    Earth,
    Globe,
    House,
    Library,
    LockKeyhole,
    LucideProps,
    Mail,
    MicVocal,
    Music,
    SquareActivity,
    StickyNote,
    Upload,
    User,
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
                title: 'dashboard',
                permission: PERMISSION.STATISTIC.READ,
            },
            {
                id: 'releases',
                label: 'releases.label',
                href: APP_ROUTES.RELEASES,
                icon: DiscAlbum,
                title: 'releases',
                permission: PERMISSION.RELEASE.READ,
            },
            {
                id: 'tracks',
                label: 'tracks.label',
                href: APP_ROUTES.TRACKS,
                icon: Music,
                title: 'tracks',
                permission: PERMISSION.TRACK.READ,
            },
            {
                id: 'distribution',
                label: 'distribution.label',
                href: APP_ROUTES.DISTRIBUTION,
                icon: Box,
                title: 'distribution',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
        ],
    },
    {
        id: 'general',
        label: 'common.general',
        children: [
            {
                id: 'labels',
                label: 'labels.label',
                href: APP_ROUTES.LABELS,
                icon: MicVocal,
                title: 'labels',
                permission: PERMISSION.LABEL.READ,
            },
            {
                id: 'artists',
                label: 'artist.label',
                href: APP_ROUTES.ARTISTS,
                icon: User,
                title: 'artists',
                permission: PERMISSION.ARTIST.READ,
            },
            {
                id: 'artist-role',
                label: 'artist.role',
                href: APP_ROUTES.ARTIST_ROLE,
                icon: Contact,
                title: 'artist-role',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'languages',
                label: 'common.language',
                href: APP_ROUTES.LANGUAGES,
                icon: Globe,
                title: 'languages',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'countries',
                label: 'country.label',
                href: APP_ROUTES.COUNTRIES,
                icon: Earth,
                title: 'countries',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'genres',
                label: 'common.genres',
                href: APP_ROUTES.GENRES,
                icon: Library,
                title: 'genres',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'dsp',
                label: 'dsp.label',
                href: APP_ROUTES.DSP,
                icon: SquareActivity,
                title: 'dsp',
                permission: PERMISSION.DISTRIBUTION.READ,
            },
            {
                id: 'email-sender',
                label: 'emailSender.label',
                href: APP_ROUTES.EMAIL_SENDER,
                icon: Mail,
                title: 'email-sender',
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
                id: 'log',
                label: 'log.label',
                href: APP_ROUTES.LOG,
                icon: StickyNote,
                title: 'Log',
                permission: PERMISSION.LOG.READ,
            },
            {
                id: 'upload',
                label: 'common.upload',
                href: APP_ROUTES.UPLOAD,
                icon: Upload,
                title: 'Upload',
                permission: PERMISSION.LOG.READ,
            },
        ],
    },
];
