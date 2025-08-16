import { APP_ROUTES } from '@/enums/routes';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { TENANT_TABS, TENANT_TYPE, TENANT_USER_TYPE } from '../enums';
import { TenantData, TenantDetail } from '../types/data';

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

export const getTenantAvatar = ({
    logo,
    icon,
    name,
}: {
    logo?: TenantDetail['logo'];
    icon?: TenantDetail['icon'];
    name?: TenantDetail['name'];
}) => {
    return logo || icon || getAvatarUrl(name ?? '');
};

export const getTenantOwnerEmail = (data: TenantDetail['tenantUser']) => {
    const result = data.find((item) => item.type === TENANT_USER_TYPE.OWNER);
    return result?.user?.email || '';
};
