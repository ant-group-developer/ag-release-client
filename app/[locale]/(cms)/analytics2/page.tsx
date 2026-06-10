'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import { useFilter } from '@/hooks/use-filter';
import PlaysTabContent from '@/modules/analytics2/components/tab/plays-tab-content';
import RevenueTabContent from '@/modules/analytics2/components/tab/revenue-tab-content';
import { ANALYTICS2_TABS } from '@/modules/analytics2/enums/tabs';
import { Analytics2DataFilter } from '@/modules/analytics2/types';
import { PageContainer } from '@ant-design/pro-components';
import { Radio, Space, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const defaultFilter: Analytics2DataFilter = {
    startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
};

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab =
        (searchParams.get('tab') as ANALYTICS2_TABS) || ANALYTICS2_TABS.VIEWS;

    const handleTabChange = (tab: ANALYTICS2_TABS) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const { dataFilter, onChangeFilter } =
        useFilter<Analytics2DataFilter>(defaultFilter);

    const fromDate = dataFilter.startDate ?? defaultFilter.startDate!;
    const toDate = dataFilter.endDate ?? defaultFilter.endDate!;

    return (
        <PageContainer
            title={messages('analytics.label')}
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
            }}
            extra={
                <Space>
                    <Radio.Group
                        buttonStyle="solid"
                        optionType="button"
                        value={activeTab}
                        onChange={(event) =>
                            handleTabChange(event.target.value as ANALYTICS2_TABS)
                        }
                        options={[
                            {
                                label: messages('common.views'),
                                value: ANALYTICS2_TABS.VIEWS,
                            },
                            {
                                label: messages('common.revenue'),
                                value: ANALYTICS2_TABS.REVENUE,
                            },
                        ]}
                    />
                    <DateSelect2
                        key="date"
                        rangePickerStyle={{ width: 180 }}
                        style={{ width: 180 }}
                        value={`${fromDate},${toDate}`}
                        onChange={(value) => {
                            const [startDate, endDate] = value
                                .toString()
                                .split(',');

                            onChangeFilter({ startDate, endDate });
                        }}
                    />
                </Space>
            }
        >
            <div className="flex flex-col gap-6">
                {activeTab === ANALYTICS2_TABS.VIEWS ? (
                    <PlaysTabContent fromDate={fromDate} toDate={toDate} />
                ) : (
                    <RevenueTabContent fromDate={fromDate} toDate={toDate} />
                )}
            </div>
        </PageContainer>
    );
}
