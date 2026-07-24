import { APP_ROUTES } from '@/enums/routes';

/** Route trang detail phát hành (release-centric). */
export const getDistributionDetailRoute = (releaseId: string) =>
    `${APP_ROUTES.DISTRIBUTIONS}/${releaseId}`;
