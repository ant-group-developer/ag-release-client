'use client';

import FullScreenModal, {
    FullScreenModalProps,
} from '@/components/ui/modal/fullScreenModal';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import useModalStore from '@/hooks/use-modal';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { DollarSign, Eye, Menu, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetAnalyticsSummary } from '../../hooks/use-get-analytics-summary';
import { AnalyticModalStoreData } from '../../types';
import OverviewChartRenderer from './advanced-mode/overview-chart-renderer';
import DetailArtistRankings from '../detail-artist/detail-artist-rankings';
import DetailDspRankings from '../detail-dsp/detail-dsp-rankings';
import DetailLabelRankings from '../detail-label/detail-label-rankings';
import DetailReleaseRankings from '../detail-release/detail-release-rankings';
import DetailTenantRankings from '../detail-tenant/detail-tenant-rankings';
import DetailTrackRankings from '../detail-track/detail-track-rankings';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import { ContentItem } from './advanced-mode/content-entity-selector';
import ControlsSidebar from './advanced-mode/controls-sidebar';

export interface AdvancedModeModalProps extends FullScreenModalProps {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function AdvancedModeModal({
    fromDate,
    toDate,
    releaseType,
    ...props
}: AdvancedModeModalProps) {
    const messages = useTranslations();
    const data = useModalStore<AnalyticModalStoreData>(
        (state) => state.dataEdit
    );
    const initialType = data?.initialType;

    const [
        {
            releaseId: urlReleaseId,
            trackId: urlTrackId,
            workspaceId: urlWorkspaceId,
            tenantId: urlTenantId,
            labelId: urlLabelId,
            dspId: urlDspId,
            artistId: urlArtistId,
        },
        setQueryParams,
    ] = useQueryStates({
        releaseId: parseAsString,
        trackId: parseAsString,
        workspaceId: parseAsString,
        tenantId: parseAsString,
        labelId: parseAsString,
        dspId: parseAsString,
        artistId: parseAsString,
    });

    const [selectedItem, setSelectedItem] = useState<ContentItem | undefined>();
    const [showSidebar, setShowSidebar] = useState(true);
    const [localFromDate, setLocalFromDate] = useState(
        fromDate || dayjs().subtract(27, 'day').format('YYYY-MM-DD')
    );
    const [localToDate, setLocalToDate] = useState(
        toDate || dayjs().format('YYYY-MM-DD')
    );
    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    useEffect(() => {
        if (props.open) {
            if (fromDate) setLocalFromDate(fromDate);
            if (toDate) setLocalToDate(toDate);
        }
    }, [props.open, fromDate, toDate]);

    // Active Entity resolution
    const activeEntity = useMemo(() => {
        if (urlTrackId) return { type: 'Track' as const, id: urlTrackId };
        if (urlReleaseId) return { type: 'Release' as const, id: urlReleaseId };
        const effectiveWorkspaceId = urlWorkspaceId || urlTenantId;
        if (effectiveWorkspaceId)
            return { type: 'Workspace' as const, id: effectiveWorkspaceId };
        if (urlLabelId) return { type: 'Label' as const, id: urlLabelId };
        if (urlDspId) return { type: 'DSP' as const, id: urlDspId };
        if (urlArtistId) return { type: 'Artist' as const, id: urlArtistId };
        return { type: 'All' as const, id: '' };
    }, [
        urlTrackId,
        urlReleaseId,
        urlWorkspaceId,
        urlTenantId,
        urlLabelId,
        urlDspId,
        urlArtistId,
    ]);

    // Single unified Analytics Summary hook replacing separate summary calls
    const { analyticsSummaryData } = useGetAnalyticsSummary(
        {
            fromDate: localFromDate,
            toDate: localToDate,
            releaseType,
            releaseId:
                activeEntity.type === 'Release' ? activeEntity.id : undefined,
            trackId:
                activeEntity.type === 'Track' ? activeEntity.id : undefined,
            workspaceId:
                activeEntity.type === 'Workspace' ? activeEntity.id : undefined,
            tenantId:
                activeEntity.type === 'Workspace' ? activeEntity.id : undefined,
            labelId:
                activeEntity.type === 'Label' ? activeEntity.id : undefined,
            dspId: activeEntity.type === 'DSP' ? activeEntity.id : undefined,
            artistId:
                activeEntity.type === 'Artist' ? activeEntity.id : undefined,
        },
        !!props.open
    );

    const handleSelectEntity = (item: {
        id: string;
        type: string;
        title?: string;
    }) => {
        setSelectedItem({
            id: item.id,
            title: item.title || item.id,
            type: item.type as any,
        });

        const resetParams = {
            releaseId: null,
            trackId: null,
            workspaceId: null,
            tenantId: null,
            labelId: null,
            dspId: null,
            artistId: null,
        };

        switch (item.type) {
            case 'Track':
                setQueryParams({ ...resetParams, trackId: item.id });
                break;
            case 'Release':
                setQueryParams({ ...resetParams, releaseId: item.id });
                break;
            case 'Workspace':
                setQueryParams({ ...resetParams, workspaceId: item.id });
                break;
            case 'Label':
                setQueryParams({ ...resetParams, labelId: item.id });
                break;
            case 'DSP':
                setQueryParams({ ...resetParams, dspId: item.id });
                break;
            case 'Artist':
                setQueryParams({ ...resetParams, artistId: item.id });
                break;
            default:
                setQueryParams({ ...resetParams, releaseId: item.id });
                break;
        }
    };

    const currentSelectedItem = useMemo<ContentItem | undefined>(() => {
        if (activeEntity.type !== 'All' && activeEntity.id) {
            if (selectedItem?.id === activeEntity.id) {
                return selectedItem;
            }
            return {
                id: activeEntity.id,
                title: selectedItem?.title || activeEntity.id,
                type: activeEntity.type,
            };
        }
        return selectedItem;
    }, [activeEntity, selectedItem]);

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: messages('analytics.totalTrendViews') || 'Views',
            value: formattedNumber(analyticsSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: messages('analytics.revenue.totalUsage') || 'Usage',
            value: formattedNumber(analyticsSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: messages('analytics.totalRevenueUsd') || 'Estimated revenue',
            value: formattedNumber(analyticsSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];



    const renderDetailContent = () => {
        const commonProps = {
            fromDate: localFromDate,
            toDate: localToDate,
            releaseType,
            activeMetric,
            enabled: props.open !== false,
        };

        switch (activeEntity.type) {
            case 'Track':
                return (
                    <DetailTrackRankings
                        isrc={activeEntity.id}
                        {...commonProps}
                    />
                );
            case 'Release':
                return (
                    <DetailReleaseRankings
                        releaseId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case 'Workspace':
                return (
                    <DetailTenantRankings
                        tenantId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case 'Label':
                return (
                    <DetailLabelRankings
                        labelId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case 'DSP':
                return (
                    <DetailDspRankings
                        pgDspId={activeEntity.id}
                        dspReportId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case 'Artist':
                return (
                    <DetailArtistRankings
                        artistId={activeEntity.id}
                        {...commonProps}
                    />
                );
            default:
                return (
                    <DetailReleaseRankings
                        releaseId={activeEntity.id}
                        {...commonProps}
                    />
                );
        }
    };

    return (
        <FullScreenModal
            {...props}
            footer={null}
            styles={{
                body: {
                    overflow: 'hidden',
                    padding: 0,
                },
            }}
            title={
                <div className="flex items-center gap-3">
                    <Button
                        size="small"
                        type="text"
                        icon={
                            <div>
                                <Menu className="opacity-70" />
                            </div>
                        }
                        onClick={() => setShowSidebar((prev) => !prev)}
                        className="flex items-center justify-center !p-1 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    />
                    <Typography.Text strong className="text-base">
                        {messages('common.advancedMode')}
                    </Typography.Text>
                </div>
            }
            width="100%"
        >
            <div className="flex h-[calc(100vh-57px)] w-full overflow-hidden">
                {/* Menu / Controls Sidebar Wrapper */}
                <div
                    className={cn(
                        'shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
                        showSidebar ? 'w-[350px] opacity-100' : 'w-0 opacity-0'
                    )}
                >
                    <div className="h-full w-[350px] overflow-y-auto">
                        <ControlsSidebar
                            fromDate={localFromDate}
                            toDate={localToDate}
                            onDateChange={(start, end) => {
                                setLocalFromDate(start);
                                setLocalToDate(end);
                            }}
                            activeMetric={activeMetric}
                            onMetricChange={setActiveMetric}
                            selectedItem={currentSelectedItem}
                            onContentSelect={handleSelectEntity}
                        />
                    </div>
                </div>

                {/* Main Content Area (Independent Scroll Area) */}
                <div className="h-full min-w-0 flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
                    <div className="flex flex-col space-y-4 p-6">
                        {/* Metric Header Tabs & Overview Chart */}
                        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-800">
                            <MetricHeaderTabs
                                items={metricTabItems}
                                activeKey={activeMetric}
                                onChangeKey={setActiveMetric}
                            />
                            <OverviewChartRenderer
                                activeEntity={activeEntity}
                                fromDate={localFromDate}
                                toDate={localToDate}
                                releaseType={releaseType}
                                activeMetric={activeMetric}
                                enabled={props.open !== false}
                            />
                        </div>

                        {/* Details / Table Section */}
                        {renderDetailContent()}
                    </div>
                </div>
            </div>
        </FullScreenModal>
    );
}
