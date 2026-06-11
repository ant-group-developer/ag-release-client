'use client';

import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
// import StreamChart from '@/modules/dashboard/components/bar-chart/stream-chart';
import ListRelease from '@/modules/dashboard/components/list-release';
// import MapChart from '@/modules/dashboard/components/map-chart';
import DateSelect2 from '@/components/ui/select/date-select2';
import { DATE_FORMAT } from '@/enums/common';
import PlaysTimelineChart from '@/modules/analytics2/components/chart/plays-timeline-chart';
import AnalyticsRankings from '@/modules/analytics2/components/ranking/analytics-rankings';
import DistributionRow from '@/modules/dashboard/components/distribution-row';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import {
    //     useGetCountCountries,
    useGetCountIssues,
    useGetCountOverview,
} from '@/modules/dashboard/hooks/use-get-count';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
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
                    <DateSelect2
                        width={240}
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

                    <ListRelease data={releasesData.items.slice(0, 10)} />

                    <DistributionRow
                        startDate={dataFilter.startDate ? dayjs(dataFilter.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : undefined}
                        endDate={dataFilter.endDate ? dayjs(dataFilter.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : undefined}
                    />

                    {/* <DashboardAnalyticsRow
                        startDate={dataFilter.startDate}
                        endDate={dataFilter.endDate}
                    />  */}

                    {/* <Row gutter={16} align="stretch"> */}
                    {/* <Col span={12}>
                            <ListTop />
                        </Col> */}
                    {/* <Col span={12}>
                            <NewUpdatesCard />
                        </Col> */}
                    {/* <Col span={8}>
                            <RecentIssuesCard issuesData={countIssuesData} />
                        </Col> */}
                    {/* </Row> */}

                    <PlaysTimelineChart
                        fromDate={dataFilter.startDate ? dayjs(dataFilter.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : ''}
                        toDate={dataFilter.endDate ? dayjs(dataFilter.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : ''}
                    />

                    <AnalyticsRankings
                        fromDate={dataFilter.startDate ? dayjs(dataFilter.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : ''}
                        toDate={dataFilter.endDate ? dayjs(dataFilter.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE) : ''}
                    />
                </div>

                {/* <ListNews /> */}
            </PageContainer>
        </div>
    );
}

export default Dashboard;
