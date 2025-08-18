import { ORDER } from '@/enums/common';
import { cn, getAvatarPlaceholder } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Avatar, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_ORDER_BY, TENANT_TYPE } from '../enums';
import { useTenantList } from '../hooks/use-get-tenant';
import { TenantData } from '../types/data';

type Props = {
    getEmail?: boolean;
    externalOnChange?: SelectProps['onChange'];
    fallback?: string;
    excludeIds?: Array<TenantData['id']>;
    type?: TENANT_TYPE[];
} & SelectProps;

function TenantSelect({
    getEmail,
    className,
    externalOnChange,
    fallback,
    excludeIds,
    type,
    ...props
}: Props) {
    const messages = useTranslations();

    const { data: dataTenant } = useTenantList({
        fieldOrder: TENANT_ORDER_BY.EMAIL,
        orderBy: ORDER.ASC,
        pageSize: 999,
    });

    const options = dataTenant.items
        .filter((item) => {
            let result = true;
            if (excludeIds) {
                result = !excludeIds.includes(item.id);
            }
            if (type) {
                result = type.includes(item.type);
            }
            return result;
        })
        .map((data) => {
            const tenantId = data.id;
            const email = data.email;
            const name = data.name;

            return {
                value: getEmail ? email : tenantId,
                label: (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={data.logo || data.icon}
                            className="flex-none"
                            size={'large'}
                        >
                            {getAvatarPlaceholder(data.name)}
                        </Avatar>
                        <p className="flex flex-1 flex-col">
                            <span className="truncate">{name}</span>
                            <span className="truncate text-gray-400">
                                {email}
                            </span>
                        </p>
                    </div>
                ),
                string: name + ' ' + email,
                // string: email,
                email,
                name,
                title: name,
            };
        });

    const handleChange: SelectProps['onChange'] = (value, option) => {
        props.onChange?.(value, option);
        externalOnChange?.(value, option);
    };

    const labelRender = (props: any) => {
        const { value, title } = props;

        if (value) {
            return title || fallback || value;
        }
        return undefined;
    };

    return (
        <Select
            placeholder={messages('tenant.label')}
            showSearch
            className={cn('w-full', className)}
            {...props}
            onChange={handleChange}
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.string ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}

export default TenantSelect;
