'use client';

import DateSelect from '@/components/ui/select/date-select';
import { useFilter } from '@/hooks/use-filter';
import AnalyticsChart from '@/modules/analytics2/components/analytics-chart';
import MetricCards from '@/modules/analytics2/components/metric-cards';
import RecentReleasesTable from '@/modules/analytics2/components/recent-releases-table';
import SyncAllButton from '@/modules/analytics2/components/sync-button';
import TracksArtistsTable from '@/modules/analytics2/components/tracks-artists-table';
import { Analytics2DataFilter } from '@/modules/analytics2/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const defaultFilter: Analytics2DataFilter = {
    startDate: dayjs().subtract(5, 'month').startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
};

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();

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
                <MetricCards fromDate={fromDate} toDate={toDate} />
                <AnalyticsChart fromDate={fromDate} toDate={toDate} />
                <TracksArtistsTable fromDate={fromDate} toDate={toDate} />
                <RecentReleasesTable fromDate={fromDate} toDate={toDate} />
            </div>
        </PageContainer>
    );
}
