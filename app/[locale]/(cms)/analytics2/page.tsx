'use client';

import DateSelect from '@/components/ui/select/date-select';
import { useFilter } from '@/hooks/use-filter';
import AnalyticsChart from '@/modules/analytics2/components/analytics-chart';
import AnalyticsDailyChart from '@/modules/analytics2/components/analytics-daily-chart';
import MetricCards from '@/modules/analytics2/components/metric-cards';
import RecentReleasesTable from '@/modules/analytics2/components/recent-releases-table';
import SyncAllButton from '@/modules/analytics2/components/sync-button';
import TracksArtistsTable from '@/modules/analytics2/components/tracks-artists-table';
import RevenueTabContent from '@/modules/analytics2/components/revenue-tab-content';
import { Analytics2DataFilter } from '@/modules/analytics2/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme, Segmented } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const defaultFilter: Analytics2DataFilter = {
    startDate: dayjs().subtract(5, 'month').startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
};

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const [activeTab, setActiveTab] = useState<'plays' | 'revenue'>('plays');

    const { dataFilter, onChangeFilter } = useFilter<Analytics2DataFilter>(defaultFilter);

    const fromDate = dataFilter.startDate ?? defaultFilter.startDate!;
    const toDate = dataFilter.endDate ?? defaultFilter.endDate!;

    return (
        <PageContainer
            title={messages('common.statistic')}
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
            }}
            extra={[
                <DateSelect
                    key="date"
                    selectClassName="w-[150px]"
                    rangeClassName="w-[250px]"
                    value={`${fromDate},${toDate}`}
                    externalOnChange={(from, to) =>
                        onChangeFilter({ startDate: from, endDate: to })
                    }
                />,
                <SyncAllButton key="sync" />,
            ]}
        >
            <div className="flex flex-col gap-6">
                <div className="flex justify-start">
                    <Segmented
                        value={activeTab}
                        onChange={(value) => setActiveTab(value as 'plays' | 'revenue')}
                        options={[
                            {
                                label: messages('analytics.tabs.plays'),
                                value: 'plays',
                            },
                            {
                                label: messages('analytics.tabs.revenue'),
                                value: 'revenue',
                            },
                        ]}
                    />
                </div>

                {activeTab === 'plays' ? (
                    <>
                        <MetricCards fromDate={fromDate} toDate={toDate} />
                        <AnalyticsChart fromDate={fromDate} toDate={toDate} />
                        <AnalyticsDailyChart />
                        <TracksArtistsTable fromDate={fromDate} toDate={toDate} />
                        <RecentReleasesTable fromDate={fromDate} toDate={toDate} />
                    </>
                ) : (
                    <RevenueTabContent fromDate={fromDate} toDate={toDate} />
                )}
            </div>
        </PageContainer>
    );
}

