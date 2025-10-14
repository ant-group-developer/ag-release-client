'use client';
import DateSelect from '@/components/ui/select/date-select';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Tabs, TabsProps, theme } from 'antd';
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
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <Link href="/analytics/revenue/dashboard">
                    <div className="flex items-center gap-2">
                        <CircleDollarSign size={SIZE_ICON} />
                        {messages('common.revenue')}
                    </div>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href="/analytics/streams/dashboard">
                    <div className="flex items-center gap-2">
                        <Tv size={SIZE_ICON} />
                        {messages('common.streams')}
                    </div>
                </Link>
            ),
        },
    ];
    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <PageContainer
                title={messages('analytics.label')}
                extra={
                    <div className="flex items-center gap-2">
                        <Link href={`${APP_ROUTES.ANALYTICS}/revenue/advanced`}>
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
                <Tabs
                    items={items}
                    className="!mb-4 rounded-lg !px-4"
                    style={{ backgroundColor: token.colorBgContainer }}
                />
                {/* </div> */}
                <div>{children}</div>
            </PageContainer>
        </div>
    );
}
