import { Skeleton } from '@/components/ui/skeleton';
import { CheckCard } from '@ant-design/pro-components';
import { Avatar, Popover } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useTenantActive } from '../hooks/use-get-tenant';
import { TenantData } from '../types/data';
import { getTenantAvatar } from '../utils';
import TenantTag from './tenant-tag';

type Props = {};

function TenantSwitch({}: Props) {
    const messages = useTranslations();
    const { data, isLoading } = useTenantActive();

    const [value, setValue] = useState<TenantData['id']>();
    const currentData = data.items.find((item) => item.id === value);

    useEffect(() => {
        setValue(data.items[0]?.id);
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex h-fit items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-8 w-40" />
            </div>
        );
    }

    return (
        <div>
            <Popover
                placement="bottomRight"
                trigger={['click']}
                content={
                    <div className="max-h-96 overflow-auto px-1">
                        <CheckCard.Group
                            style={{
                                display: 'grid',
                            }}
                            onChange={(id) => {
                                if (typeof id === 'string') {
                                    setValue(id);
                                }
                            }}
                            value={value}
                        >
                            {data.items.map((item) => (
                                <CheckCard
                                    key={item.id}
                                    value={item.id}
                                    avatar={getTenantAvatar({
                                        logo: item.logo,
                                        icon: item.icon,
                                        name: item.name,
                                    })}
                                    title={
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                {item.name}
                                            </span>
                                            <TenantTag type={item.type} />
                                        </p>
                                    }
                                    description={
                                        <div className="space-y-0.5 truncate text-xs">
                                            <p>
                                                {messages('tenant.owner')}:{' '}
                                                {item.owner.email}
                                            </p>
                                            {item.parent && (
                                                <p>
                                                    {messages('tenant.manager')}
                                                    :{' '}
                                                    <span className="font-semibold">
                                                        {item.parent.name}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    }
                                    style={{
                                        marginInlineEnd: 0,
                                        marginBlockEnd: 8,
                                    }}
                                />
                            ))}
                        </CheckCard.Group>
                    </div>
                }
            >
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-200/70 dark:hover:bg-zinc-800">
                    <Avatar
                        src={getTenantAvatar({
                            logo: currentData?.logo,
                            icon: currentData?.icon,
                            name: currentData?.name,
                        })}
                        size={45}
                        shape="square"
                    />
                    <h2 className="flex-1 text-2xl font-bold">
                        {currentData?.name}
                    </h2>
                </div>
            </Popover>
        </div>
    );
}

export default TenantSwitch;
