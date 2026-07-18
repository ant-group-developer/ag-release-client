import { APP_ROUTES } from '@/enums/routes';
import { ARTIST_DETAIL_TABS } from '../enum';

export const getArtistDetailRoute = (
    artistId: string,
    tab: ARTIST_DETAIL_TABS
) => `/${APP_ROUTES.ARTISTS}/detail/${artistId}/${tab}`;
