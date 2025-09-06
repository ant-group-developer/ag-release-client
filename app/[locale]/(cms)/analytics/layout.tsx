'use client';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import AnalyticsHeader from '@/modules/analytics/header';
import { Menu, theme } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import dayjs from 'dayjs';
import { CircleDollarSign, Tv } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';

type Props = {};

export default function AnalyticsLayout({ children }: PropsWithChildren) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dataFilter, onChangeFilter } = useFilter({
        pageSize: PAGE_SIZE,
        startDateCreated: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        endDateCreated: dayjs().format('YYYY-MM-DD'),
    });
    const items: ItemType[] = [
        {
            key: '1',
            icon: <CircleDollarSign size={SIZE_ICON} />,
            label: (
                <Link href="/analytics/revenue/dashboard">
                    {messages('common.revenue')}
                </Link>
            ),
        },
        {
            key: '2',
            icon: <Tv size={SIZE_ICON} />,
            label: (
                <Link href="/analytics/streams/dashboard">
                    {messages('common.streams')}
                </Link>
            ),
        },
    ];
    return (
        <div className="">
            <div className="sticky top-0 z-10 bg-white">
                <AnalyticsHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="horizontal"
                    items={items}
                    style={{ backgroundColor: token.colorBgContainer }}
                />
            </div>
            <div>{children}</div>
        </div>
    );
}
