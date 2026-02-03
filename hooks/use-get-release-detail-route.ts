'use client';

import { APP_ROUTES } from '@/enums/routes';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useSearchParams } from 'next/navigation';

export const useGetReleaseDetailRoute = () => {
    const searchParams = useSearchParams();
    const currentAction = searchParams.get('action') as RELEASE_DETAIL_ACTION;

    const getReleaseTabRoute = (
        releaseId: string,
        tab: RELEASES_TABS,
        action?: RELEASE_DETAIL_ACTION
    ) => {
        const tempAction = action ?? currentAction;

        return `/${APP_ROUTES.RELEASES}/detail/${releaseId}/${tab}${tempAction ? `?action=${tempAction}` : ''}`;
    };

    return {
        getReleaseTabRoute,
        action: currentAction,
    };
};
