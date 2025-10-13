'use client';

import DateSelect from '@/components/ui/select/date-select';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import StreamChart from '@/modules/dashboard/components/bar-chart/stream-chart';
import ListNews from '@/modules/dashboard/components/list-news';
import ListRelease from '@/modules/dashboard/components/list-release';
import ListTop from '@/modules/dashboard/components/list-top';
import MapChart from '@/modules/dashboard/components/map-chart';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import NewUpdatesCard from '@/modules/dashboard/components/stats-overview/updated-news-card';
import IssueTable from '@/modules/dashboard/components/table/issue-table';
import {
    useGetCountCountries,
    useGetCountIssues,
    useGetCountOverview,
} from '@/modules/dashboard/hooks/use-get-count';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { PageContainer } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {};

function Dashboard({}: Props) {
    // const router = useRouter();
    // const { token } = theme.useToken();
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
    const { countCountriesData } = useGetCountCountries(dataFilter);

    return (
        <div className="bg-[#f5f5f5]">
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

                <div className="flex flex-col gap-4 overflow-auto">
                    <StatsOverview
                        issuesData={countIssuesData}
                        overviewData={countOverviewData}
                        isIssuesLoading={isIssuesLoading}
                        isOverviewLoading={isOverviewLoading}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
                        {/* <StatCard
                            className="bg-white"
                            title={messages('common.issues')}
                            data={countIssuesData?.map((item) => ({
                                label: item?.nameEn,
                                count: Number(item?.total),
                            }))}
                            loading={isIssuesLoading}
                        /> */}
                        <div className="rounded-lg border bg-white">
                            <IssueTable
                                className="h-full"
                                dataSource={countIssuesData}
                                scroll={{ x: 'max-content', y: 300 }}
                            />
                        </div>
                        <NewUpdatesCard />
                        <MapChart
                            className="bg-white"
                            data={countCountriesData}
                        />
                    </div>

                    {/* <DspChart /> */}
                    <div className="grid grid-cols-3 gap-4">
                        <ListTop />
                        <div className="col-span-2">
                            <StreamChart />
                        </div>
                    </div>

                    <ListRelease data={releasesData.items.slice(0, 7)} />

                    <ListNews />
                </div>
            </PageContainer>
        </div>
    );
}

export default Dashboard;
