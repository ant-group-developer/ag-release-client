import { cn } from '@/helpers/common';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_USER_TYPE } from '../enums';

interface Props extends SelectProps {}

function TenantUserTypeSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const options = [
        {
            label: messages('tenant.userType.owner.label'),
            value: TENANT_USER_TYPE.OWNER,
        },
        {
            label: messages('tenant.userType.admin.label'),
            value: TENANT_USER_TYPE.ADMIN,
        },
        {
            label: messages('tenant.userType.member.label'),
            value: TENANT_USER_TYPE.MEMBER,
        },
    ];
    return (
        <Select
            className={cn('w-full', className)}
            placeholder={messages('tenant.userType.label')}
            {...props}
            options={options}
        />
    );
}

export default TenantUserTypeSelect;
