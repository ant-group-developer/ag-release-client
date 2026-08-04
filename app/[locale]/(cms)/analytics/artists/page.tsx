'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import ArtistRankingTableCard from '@/modules/analytics2/components/ranking/artist-ranking-table-card';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function ArtistsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter } = useFilter<RankingFilter>({
        startDate:
            searchParams.get('fromDate') || ANALYTICS_DEFAULT_START_DATE,
        endDate: searchParams.get('toDate') || ANALYTICS_DEFAULT_END_DATE,
        type: getAnalyticsViewType(searchParams.get('type')),
        releaseType: getAnalyticsReleaseType(
            searchParams.get('releaseType')
        ),
    });

    const isRevenue = dataFilter.type === ANALYTICS_VIEW_TYPE.REVENUE;

    const pageTitle = isRevenue
        ? `${messages('artist.artists')} - ${messages('common.revenue')}`
        : `${messages('artist.artists')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS,
        },
        {
            title: pageTitle,
        },
    ];

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <PageContainer
                title={pageTitle}
                header={{
                    breadcrumb: {
                        items: breadcrumbs,
                    },
                }}
                extra={
                    <DateSelect2
                        style={{ width: 240 }}
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        onChange={(value) => {
                            const [start, end] = value.toString().split(',');
                            onChangeFilter({
                                startDate: start,
                                endDate: end,
                            });
                        }}
                        picker="date"
                    />
                }
            >
                <ArtistRankingTableCard
                    fromDate={dataFilter.startDate}
                    toDate={dataFilter.endDate}
                    releaseType={dataFilter.releaseType}
                />
            </PageContainer>
        </div>
    );
}
