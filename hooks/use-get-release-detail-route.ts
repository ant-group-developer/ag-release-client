'use client';

import { APP_ROUTES } from '@/enums/routes';
import { RELEASES_TABS } from '@/modules/releases/enums';

export const useGetReleaseDetailRoute = () => {
    // const params = useParams();
    // const searchParams = useSearchParams();

    const getReleaseTabRoute = (releaseId: string, tab: RELEASES_TABS) => {
        return `${APP_ROUTES.RELEASES}/detail/${releaseId}/${tab}`;
    };

    return {
        getReleaseTabRoute,
    };
};
