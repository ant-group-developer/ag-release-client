'use client';
import DateSelect from '@/components/ui/select/date-select';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@ant-design/pro-components';
import { Button, theme } from 'antd';
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
        <div className="bg-[#f5f5f5]">
            <PageContainer
                title={messages('common.statistics')}
                extra={
                    <div className="flex items-center gap-2">
                        <Link href={`${APP_ROUTES.ANALYTICS}/advanced`}>
                            <Button> {messages('common.seeMore')} </Button>
                        </Link>
                        <DateSelect
                            selectClassName="w-[150px]"
                            rangeClassName="w-[250px]"
                            externalOnChange={(fromDate, toDate) =>
                                onChangeFilter({
                                    startDateCreated: fromDate,
                                    endDateCreated: toDate,
                                })
                            }
                            value={`${dataFilter.startDateCreated},${dataFilter.endDateCreated}`}
                        />
                    </div>
                }
            >
                {/* <div className="sticky top-0 z-10 bg-white"> */}
                {/* <AnalyticsHeader
                        dataFilter={dataFilter}
                        onChangeFilter={onChangeFilter}
                    /> */}
                {/* <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="horizontal"
                        items={items}
                        style={{ backgroundColor: token.colorBgContainer }}
                    /> */}
                {/* </div> */}
                <div>{children}</div>
            </PageContainer>
        </div>
    );
}
