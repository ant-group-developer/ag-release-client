'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import { useFilter } from '@/hooks/use-filter';
import ExportReportProgressPopover from '@/modules/analytics2/components/export-report-progress-popover';
import ExportReportModal from '@/modules/analytics2/components/modal/export-report-modal';
import PlaysTabContent from '@/modules/analytics2/components/tab/plays-tab-content';
import RevenueTabContent from '@/modules/analytics2/components/tab/revenue-tab-content';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS2_TABS } from '@/modules/analytics2/enums/tabs';
import {
    Analytics2DataFilter,
    ExportReportJob,
} from '@/modules/analytics2/types';
import {
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_DEFAULT_END_DATE,
} from '@/modules/analytics2/constants/types';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Radio, Space, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultFilter: Analytics2DataFilter = {
    startDate: ANALYTICS_DEFAULT_START_DATE,
    endDate: ANALYTICS_DEFAULT_END_DATE,
    releaseType: ANALYTICS_RELEASE_TYPE.AUDIO,
};

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExportProgressOpen, setIsExportProgressOpen] = useState(false);
    const [exportJobs, setExportJobs] = useState<ExportReportJob[]>([]);

    const handleExportStarted = (jobId: string) => {
        setExportJobs((prevJobs) => {
            if (prevJobs.some((job) => job.id === jobId)) return prevJobs;

            return [
                ...prevJobs,
                {
                    id: jobId,
                    createdAt: Date.now(),
                },
            ];
        });
        setIsExportProgressOpen(true);
    };

    const handleRemoveExportJob = (jobId: string) => {
        setExportJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    };

    useEffect(() => {
        if (!exportJobs.length) {
            setIsExportProgressOpen(false);
        }
    }, [exportJobs.length]);

    const initialTab =
        (searchParams.get('tab') as ANALYTICS2_TABS) || ANALYTICS2_TABS.VIEWS;
    const [activeTab, setActiveTab] = useState<ANALYTICS2_TABS>(initialTab);

    const initialReleaseType =
        (searchParams.get('releaseType') as ANALYTICS_RELEASE_TYPE) ||
        ANALYTICS_RELEASE_TYPE.AUDIO;
    const [releaseType, setReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(initialReleaseType);

    useEffect(() => {
        const queryTab =
            (searchParams.get('tab') as ANALYTICS2_TABS) ||
            ANALYTICS2_TABS.VIEWS;
        setActiveTab(queryTab);

        const queryReleaseType =
            (searchParams.get('releaseType') as ANALYTICS_RELEASE_TYPE) ||
            ANALYTICS_RELEASE_TYPE.AUDIO;
        setReleaseType(queryReleaseType);
    }, [searchParams]);

    const handleTabChange = (tab: ANALYTICS2_TABS) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const { dataFilter, onChangeFilter } =
        useFilter<Analytics2DataFilter>(defaultFilter);

    const handleReleaseTypeChange = (type: ANALYTICS_RELEASE_TYPE) => {
        setReleaseType(type);
        onChangeFilter({ releaseType: type });
    };

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
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => {
                            if (exportJobs.length) {
                                setIsExportProgressOpen(true);
                            }

                            setIsExportModalOpen(true);
                        }}
                    >
                        {messages('common.exportReport')}
                    </Button>
                    <Radio.Group
                        buttonStyle="solid"
                        optionType="button"
                        value={releaseType}
                        onChange={(event) =>
                            handleReleaseTypeChange(
                                event.target.value as ANALYTICS_RELEASE_TYPE
                            )
                        }
                        options={[
                            {
                                label: messages('common.audio'),
                                value: ANALYTICS_RELEASE_TYPE.AUDIO,
                            },
                            {
                                label: messages('common.video'),
                                value: ANALYTICS_RELEASE_TYPE.VIDEO,
                            },
                        ]}
                    />
                    <Radio.Group
                        buttonStyle="solid"
                        optionType="button"
                        value={activeTab}
                        onChange={(event) =>
                            handleTabChange(
                                event.target.value as ANALYTICS2_TABS
                            )
                        }
                        options={[
                            {
                                label: messages('analytics.trendViews'),
                                value: ANALYTICS2_TABS.VIEWS,
                            },
                            {
                                label: messages('common.revenue'),
                                value: ANALYTICS2_TABS.REVENUE,
                            },
                        ]}
                    />
                    <DateSelect2
                        style={{ width: 240 }}
                        value={`${fromDate},${toDate}`}
                        onChange={(value) => {
                            const [startDate, endDate] = value
                                .toString()
                                .split(',');

                            onChangeFilter({ startDate, endDate });
                        }}
                        picker="month"
                    />
                </Space>
            }
        >
            <div className="flex flex-col gap-6">
                {activeTab === ANALYTICS2_TABS.VIEWS ? (
                    <PlaysTabContent
                        fromDate={fromDate}
                        toDate={toDate}
                        releaseType={releaseType}
                    />
                ) : (
                    <RevenueTabContent
                        fromDate={fromDate}
                        toDate={toDate}
                        releaseType={releaseType}
                    />
                )}
            </div>

            <ExportReportModal
                open={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExportStarted={handleExportStarted}
                dataFilter={dataFilter}
            />

            {isExportProgressOpen && exportJobs.length ? (
                <ExportReportProgressPopover
                    jobs={exportJobs}
                    onClose={() => {
                        setIsExportProgressOpen(false);
                        setExportJobs([]);
                    }}
                    onRemoveJob={handleRemoveExportJob}
                />
            ) : null}
        </PageContainer>
    );
}
