import { APP_ROUTES } from '@/enums/routes';
import { RELEASES_TABS } from '../enums';

export enum RELEASE_DETAIL_ACTION {
    EDIT = 'edit',
    READ = 'read',
}

export const getReleaseDetailTabRoute = (
    releaseId: string,
    tab: RELEASES_TABS
) => `/${APP_ROUTES.RELEASES}/detail/${releaseId}/${tab}`;
