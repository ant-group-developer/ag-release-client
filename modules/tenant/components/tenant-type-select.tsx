import { cn } from '@/helpers/common';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_TYPE } from '../enums';

interface Props extends SelectProps {}

function TenantTypeSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const options = [
        {
            label: messages('tenant.type.whiteLabel.label'),
            value: TENANT_TYPE.WHITE_LABEL,
        },
        {
            label: messages('tenant.type.label.label'),
            value: TENANT_TYPE.LABEL,
        },
    ];
    return (
        <Select
            className={cn('w-full', className)}
            placeholder={messages('tenant.type.title')}
            {...props}
            options={options}
        />
    );
}

export default TenantTypeSelect;
