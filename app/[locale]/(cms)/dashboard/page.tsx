'use client';

import DateSelect from '@/components/ui/select/date-select';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
// import StreamChart from '@/modules/dashboard/components/bar-chart/stream-chart';
import DistributionRow from '@/modules/dashboard/components/distribution-row';
import ListRelease from '@/modules/dashboard/components/list-release';
import ListTop from '@/modules/dashboard/components/list-top';
// import MapChart from '@/modules/dashboard/components/map-chart';
import RecentIssuesCard from '@/modules/dashboard/components/recent-issues';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import NewUpdatesCard from '@/modules/dashboard/components/stats-overview/updated-news-card';
import {
    //     useGetCountCountries,
    useGetCountIssues,
    useGetCountOverview,
} from '@/modules/dashboard/hooks/use-get-count';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {};

function Dashboard({}: Props) {
    // const router = useRouter();
    const { token } = theme.useToken();
    const [startDate] = useState(() =>
        dayjs().subtract(30, 'day').toISOString()
    );
    const [endDate] = useState(() => dayjs().toISOString());

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DashboardDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        startDate,
        endDate,
    });
    const messages = useTranslations();
    const { releasesData } = useGetListReleases(dataFilter);
    const { countIssuesData, isFetching: isIssuesLoading } =
        useGetCountIssues(dataFilter);
    const { countOverviewData, isFetching: isOverviewLoading } =
        useGetCountOverview(dataFilter);
    // const { countCountriesData } = useGetCountCountries(dataFilter);

    return (
        <div
            style={{
                backgroundColor: token.colorBgLayout,
            }}
        >
            <PageContainer
                title={messages('dashboard.label')}
                extra={
                    <DateSelect
                        selectClassName="w-[150px]"
                        rangeClassName="w-[250px]"
                        externalOnChange={(fromDate, toDate) =>
                            onChangeFilter({
                                startDate: fromDate,
                                endDate: toDate,
                            })
                        }
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                    />
                }
            >
                {/* <DashboardHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

                <div className="flex flex-col gap-4">
                    <StatsOverview
                        issuesData={countIssuesData}
                        overviewData={countOverviewData}
                        isIssuesLoading={isIssuesLoading}
                        isOverviewLoading={isOverviewLoading}
                    />

                    <ListRelease data={releasesData.items.slice(0, 7)} />

                    <DistributionRow />

                    <Row gutter={16} align="stretch">
                        <Col span={8}>
                            <ListTop />
                        </Col>
                        <Col span={8}>
                            <NewUpdatesCard />
                        </Col>
                        <Col span={8}>
                            <RecentIssuesCard issuesData={countIssuesData} />
                        </Col>
                    </Row>
                </div>

                {/* <ListNews /> */}
            </PageContainer>
        </div>
    );
}

export default Dashboard;
