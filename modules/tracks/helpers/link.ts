import { APP_ROUTES } from '@/enums/routes';
import { TRACK_TABS } from '../enums';

export const getTrackDetailRoute = (trackId: string, tab: TRACK_TABS) =>
    `/${APP_ROUTES.TRACKS}/detail/${trackId}/${tab}`;
