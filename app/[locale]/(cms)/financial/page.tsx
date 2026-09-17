'use client';

import {
    FinancialMetricCards,
    RecentTransactionsCard,
    RevenueShareCard,
    RoyaltiesByMonthCard,
    TopArtistsCard,
} from '@/modules/financial';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function FinancialPage() {
    const { token } = theme.useToken();
    const t = useTranslations('financial');

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs('2026-04-01'),
        dayjs('2026-09-30'),
    ]);

    const fromDate = dateRange[0].format('YYYY-MM-DD');
    const toDate = dateRange[1].format('YYYY-MM-DD');

    return (
        <div
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
                marginTop: '24px',
            }}
        >
            <PageContainer
            // title={t('title')}
            // extra={
            //     <DateSelect2
            //         className="!w-full sm:!w-[240px]"
            //         value={`${fromDate},${toDate}`}
            //         onChange={(value) => {
            //             const [start, end] = value.toString().split(',');
            //             if (start && end) {
            //                 setDateRange([dayjs(start), dayjs(end)]);
            //             }
            //         }}
            //         picker="month"
            //     />
            // }
            >
                <div className="mx-auto flex max-w-[1600px] flex-col gap-4 pb-8">
                    {/* Summary Metric Cards (4 Cards) */}
                    <FinancialMetricCards />

                    {/* Main Content Layout: Left Column (7 cols) + Right Column (5 cols) */}
                    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                        {/* Cột trái (col-span-7): Royalties by Month + Recent transactions (thu gọn bé lại) */}
                        <div className="flex flex-col gap-6 lg:col-span-7">
                            <RoyaltiesByMonthCard />
                            <RecentTransactionsCard />
                        </div>

                        {/* Cột phải (col-span-5): Top Artists by Revenue kéo dài dọc theo toàn bộ chiều cao */}
                        <div className="lg:col-span-5">
                            <TopArtistsCard
                                fromDate={fromDate}
                                toDate={toDate}
                            />
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}
