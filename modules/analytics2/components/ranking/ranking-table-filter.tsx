'use client';

import AppSearch, { AppSearchProps } from '@/components/ui/input/search';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { Segmented, SegmentedProps } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

export interface RankingTableFilterProps {
    keyword?: string;
    onSearch?: AppSearchProps['onChange'];
    showSearch?: boolean;
    searchPlaceholder?: string;

    releaseType?: ANALYTICS_RELEASE_TYPE;
    onReleaseTypeChange?: (value: ANALYTICS_RELEASE_TYPE) => void;
    showReleaseType?: boolean;
    releaseTypeOptions?: SegmentedProps['options'];

    metricType?: ANALYTICS_VIEW_TYPE;
    onMetricTypeChange?: (value: ANALYTICS_VIEW_TYPE) => void;
    showMetricType?: boolean;
    metricTypeOptions?: SegmentedProps['options'];

    children?: React.ReactNode;
    className?: string;
}

export default function RankingTableFilter({
    keyword,
    onSearch,
    showSearch = true,
    searchPlaceholder,
    releaseType,
    onReleaseTypeChange,
    showReleaseType = false,
    releaseTypeOptions,
    metricType,
    onMetricTypeChange,
    showMetricType = false,
    metricTypeOptions,
    children,
    className = 'mb-4',
}: RankingTableFilterProps) {
    const messages = useTranslations();

    const defaultReleaseOptions: SegmentedProps['options'] = [
        {
            label: messages('common.all'),
            value: ANALYTICS_RELEASE_TYPE.ALL,
        },
        {
            label: messages('common.audio'),
            value: ANALYTICS_RELEASE_TYPE.AUDIO,
        },
        {
            label: messages('common.video'),
            value: ANALYTICS_RELEASE_TYPE.VIDEO,
        },
    ];

    const defaultMetricOptions: SegmentedProps['options'] = [
        {
            label: messages('common.views'),
            value: ANALYTICS_VIEW_TYPE.VIEW,
        },
        {
            label: messages('common.revenue'),
            value: ANALYTICS_VIEW_TYPE.REVENUE,
        },
    ];

    return (
        <div
            className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}
        >
            {showSearch ? (
                <AppSearch
                    onChange={onSearch}
                    defaultValue={keyword}
                    placeholder={searchPlaceholder}
                    wrapperClassName="w-full md:w-[200px]"
                    className="w-full"
                />
            ) : (
                <div />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {showReleaseType && onReleaseTypeChange && (
                    <Segmented
                        key="releaseType"
                        value={releaseType ?? ANALYTICS_RELEASE_TYPE.ALL}
                        onChange={(value) =>
                            onReleaseTypeChange(value as ANALYTICS_RELEASE_TYPE)
                        }
                        className="w-full sm:w-auto [&_.ant-segmented-group]:w-full sm:[&_.ant-segmented-group]:w-auto [&_.ant-segmented-item]:flex-1 sm:[&_.ant-segmented-item]:flex-none"
                        options={releaseTypeOptions || defaultReleaseOptions}
                    />
                )}

                {/* {showMetricType && onMetricTypeChange && (
                    <Segmented
                        key="metricType"
                        value={metricType ?? ANALYTICS_VIEW_TYPE.VIEW}
                        onChange={(value) =>
                            onMetricTypeChange(value as ANALYTICS_VIEW_TYPE)
                        }
                        className="w-full sm:w-auto [&_.ant-segmented-group]:w-full sm:[&_.ant-segmented-group]:w-auto [&_.ant-segmented-item]:flex-1 sm:[&_.ant-segmented-item]:flex-none"
                        options={metricTypeOptions || defaultMetricOptions}
                    />
                )} */}

                {children}
            </div>
        </div>
    );
}
