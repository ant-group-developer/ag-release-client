'use client';

import { ANALYTICS_ENTITY_TYPE } from '@/modules/analytics2/enums';
import {
    AnalyticsEntityType,
    AnalyticsFilterItem,
} from '@/modules/analytics2/types';
import { Button, Tag, Typography } from 'antd';
import {
    Briefcase,
    Building2,
    Disc,
    Filter,
    Music,
    Radio,
    Share2,
    Tv,
    User,
    Video,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export interface FilterChipsBarProps {
    filters: AnalyticsFilterItem[];
    onRemoveFilter: (type: AnalyticsEntityType) => void;
    onClearAll: () => void;
    className?: string;
}

const getEntityIcon = (type: AnalyticsEntityType) => {
    switch (type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return Music;
        case ANALYTICS_ENTITY_TYPE.RELEASE:
            return Disc;
        case ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO:
            return Video;
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return User;
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return Building2;
        case ANALYTICS_ENTITY_TYPE.DSP:
            return Radio;
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return Briefcase;
        case ANALYTICS_ENTITY_TYPE.CHANNEL:
            return Tv;
        case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
            return Share2;
        default:
            return Filter;
    }
};

export default function FilterChipsBar({
    filters,
    onRemoveFilter,
    onClearAll,
    className = '',
}: FilterChipsBarProps) {
    const messages = useTranslations();

    if (!filters || filters.length === 0) {
        return null;
    }

    const getTypeLabel = (type: AnalyticsEntityType) => {
        const lowerType = String(type).toLowerCase();
        const intlKey = `common.${lowerType}`;
        if (messages.has(intlKey as any)) {
            return messages(intlKey as any);
        }
        return type;
    };

    return (
        <div
            className={`flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 ${className}`}
        >
            <div className="flex items-center gap-1.5 pl-1">
                <Filter className="h-3.5 w-3.5 opacity-60" />
                <Typography.Text type="secondary" className="text-xs font-medium">
                    {messages('common.filter')}:
                </Typography.Text>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                {filters.map((filter) => {
                    const Icon = getEntityIcon(filter.type);
                    const typeLabel = getTypeLabel(filter.type);

                    return (
                        <Tag
                            key={`${filter.type}-${filter.id}`}
                            icon={
                                <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                            }
                            closable
                            onClose={(e) => {
                                e.preventDefault();
                                onRemoveFilter(filter.type);
                            }}
                            className="!m-0 !inline-flex items-center gap-1 rounded-md border-blue-200 bg-blue-50 py-0.5 px-2 text-xs dark:border-blue-900 dark:bg-blue-950/40"
                        >
                            <span className="inline-flex items-center gap-1 max-w-[220px]">
                                <span className="text-xs font-medium shrink-0">
                                    {typeLabel}:
                                </span>
                                <Typography.Text
                                    ellipsis={{ tooltip: filter.title }}
                                    className="text-xs font-semibold"
                                >
                                    {filter.title}
                                </Typography.Text>
                            </span>
                        </Tag>
                    );
                })}
            </div>

            <Button
                type="link"
                size="small"
                onClick={onClearAll}
                className="!px-1.5 !py-0 !h-auto text-xs"
            >
                <Typography.Text
                    type="secondary"
                    className="text-xs transition-colors hover:underline"
                >
                    {messages('common.clearFilter')}
                </Typography.Text>
            </Button>
        </div>
    );
}
