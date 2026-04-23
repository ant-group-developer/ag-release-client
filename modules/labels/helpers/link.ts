import { APP_ROUTES } from '@/enums/routes';
import { LABEL_DETAIL_TABS } from '../enum';

export const getLabelDetailRoute = (labelId: string, tab: LABEL_DETAIL_TABS) =>
    `/${APP_ROUTES.LABELS}/detail/${labelId}/${tab}`;
