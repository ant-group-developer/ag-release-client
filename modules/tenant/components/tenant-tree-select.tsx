import { ORDER } from '@/enums/common';
import { cn } from '@/helpers/common';
import { TreeSelect, TreeSelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_ORDER_BY, TENANT_TYPE } from '../enums';
import { useTenantList } from '../hooks/use-get-tenant';
import { TenantData } from '../types/data';

type Props = {
    getEmail?: boolean;
    externalOnChange?: TreeSelectProps['onChange'];
    fallback?: string;
    excludeIds?: Array<TenantData['id']>;
    type?: TENANT_TYPE[];
} & TreeSelectProps;

function TenantTreeSelect({
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

    const getTreeData = (data: TenantData[]): TreeSelectProps['treeData'] => {
        return data.map((item) => {
            let children;
            if (item.children.length) {
                children = getTreeData(item.children);
            }

            return {
                value: item.id,
                // title: (
                //     <div className="flex items-center gap-2">
                //         <Avatar
                //             src={item.logo || item.icon}
                //             className="flex-none"
                //             size={'large'}
                //         >
                //             {getAvatarPlaceholder(item.name)}
                //         </Avatar>
                //         <p className="flex flex-1 flex-col">
                //             <span className="truncate">{item.name}</span>
                //             <span className="truncate text-gray-400">
                //                 {getTenantOwnerEmail(item.tenantUser)}
                //             </span>
                //         </p>
                //     </div>
                // ),
                title: item.name,
                children,
            };
        });
    };

    const treeData = getTreeData(dataTenant.items);

    return (
        <TreeSelect
            placeholder={messages('tenant.label')}
            showSearch
            className={cn('w-full', className)}
            allowClear
            treeDefaultExpandAll
            {...props}
            treeData={treeData}
        />
    );
}

export default TenantTreeSelect;
