import { APP_ROUTES } from '@/enums/routes';
import { PERMISSION } from '@/modules/auth/constants/permission';
import {
    House,
    LockKeyhole,
    LucideProps,
    StickyNote,
    Upload,
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
            {
                id: 'dashboard',
                label: 'dashboard.label',
                href: APP_ROUTES.DASHBOARD,
                icon: House,
                title: 'dashboard',
                permission: PERMISSION.STATISTIC.READ,
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
