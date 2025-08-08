import { APP_ROUTES } from '@/enums/routes';
import { TENANT_TABS, TENANT_TYPE } from '../enums';
import { TenantData } from '../types/data';

export const getTenantDetailRoute = (
    id: TenantData['id'],
    tab: TENANT_TABS
) => {
    return `${APP_ROUTES.TENANT}/${id}/${tab}`;
};

export const getTenantTypeLabel = (type: TENANT_TYPE, messages: any) => {
    if (type === TENANT_TYPE.LABEL) return messages('tenant.type.label.label');
    if (type === TENANT_TYPE.WHITE_LABEL)
        return messages('tenant.type.whiteLabel.label');
    return type;
};
