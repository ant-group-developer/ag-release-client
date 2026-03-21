'use client';

import AnalyticsChart from '@/modules/analytics2/components/analytics-chart';
import MetricCards from '@/modules/analytics2/components/metric-cards';
import TracksArtistsTable from '@/modules/analytics2/components/tracks-artists-table';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { PageContainer } from '@ant-design/pro-components';
import { Select, theme } from 'antd';
import { useTranslations } from 'next-intl';

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const { dspData } = useGetListDsp({ page: 1, pageSize: 100 });

    return (
        <PageContainer
            title={messages('common.statistic')}
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
            }}
            extra={[
                <Select
                    key="platform"
                    defaultValue="all-platforms"
                    style={{ width: 160 }}
                    options={[
                        { value: 'all-platforms', label: 'All platforms' },
                        ...(dspData?.items?.map((dsp) => ({
                            value: dsp.id,
                            label: dsp.name,
                        })) || []),
                    ]}
                />,
                <Select
                    key="region"
                    defaultValue="all-regions"
                    style={{ width: 160 }}
                    options={[
                        { value: 'all-regions', label: 'All Regions' },
                        { value: 'vn', label: 'Vietnam' },
                        { value: 'us', label: 'United States' },
                    ]}
                />,
            ]}
        >
            <div className="flex flex-col gap-6">
                <MetricCards />
                <AnalyticsChart />
                <TracksArtistsTable />
            </div>
        </PageContainer>
    );
}
