'use client';

import { useFilter } from '@/hooks/use-filter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CommonParams } from '@/types/api';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_MODAL_TYPE,
} from '../enums';
import { AnalyticsEntityType, AnalyticsFilterItem } from '../types';

export const ADVANCED_MODE_PARAM_PREFIX = 'am_';
export const MODAL_PARAM_KEY = 'modal';

interface AdvancedModeFilter extends CommonParams {
    entityType?: AnalyticsEntityType;
    entityId?: string;
    entitySubId?: string;
    entityTitle?: string;
    entityThumbnail?: string;
    fromDate?: string;
    toDate?: string;
    metric?: ANALYTICS_METRIC_KEY;
    rankBy?: AnalyticsEntityType;
}

export interface OpenAdvancedModeParams {
    entityType: AnalyticsEntityType;
    entityId?: string;
    entitySubId?: string;
    entityTitle?: string;
    entityThumbnail?: string | null;
    fromDate?: string;
    toDate?: string;
    metric?: ANALYTICS_METRIC_KEY;
}

export interface AdvancedModeEntity {
    type: AnalyticsEntityType;
    id?: string;
    entitySubId?: string;
    title?: string;
    thumbnail?: string;
}

export function useAdvancedModeModal() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter } = useFilter<AdvancedModeFilter>(
        {},
        {
            paramPrefix: ADVANCED_MODE_PARAM_PREFIX,
            history: 'replace',
        }
    );

    const isOpen =
        searchParams?.get(MODAL_PARAM_KEY) ===
        ANALYTICS_MODAL_TYPE.ADVANCED_MODE;

    const filterParamKey = `${ADVANCED_MODE_PARAM_PREFIX}filters`;

    const filters: AnalyticsFilterItem[] = useMemo(() => {
        const raw = searchParams?.get(filterParamKey);
        if (!raw) return [];
        try {
            const decoded = raw.startsWith('%') ? decodeURIComponent(raw) : raw;
            const parsed = JSON.parse(decoded);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [searchParams, filterParamKey]);

    const entity: AdvancedModeEntity = {
        type: dataFilter.entityType || ANALYTICS_ENTITY_TYPE.RELEASE,
        id: dataFilter.entityId,
        entitySubId: dataFilter.entitySubId,
        title: dataFilter.entityTitle,
        thumbnail: dataFilter.entityThumbnail,
    };

    const openAdvancedMode = ({
        entityType,
        entityId,
        entitySubId,
        entityTitle,
        entityThumbnail,
        fromDate,
        toDate,
        metric,
    }: OpenAdvancedModeParams) => {
        const next = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );

        next.set(MODAL_PARAM_KEY, ANALYTICS_MODAL_TYPE.ADVANCED_MODE);

        const params: AdvancedModeFilter = {
            entityType,
            entityId,
            entitySubId,
            entityTitle,
            entityThumbnail: entityThumbnail || undefined,
            fromDate,
            toDate,
            metric,
        };

        Object.entries(params).forEach(([key, value]) => {
            const paramKey = `${ADVANCED_MODE_PARAM_PREFIX}${key}`;
            if (value) {
                next.set(paramKey, String(value));
            } else {
                next.delete(paramKey);
            }
        });

        router.replace(`${pathname}?${next.toString()}`);
    };

    const closeAdvancedMode = () => {
        const next = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );

        next.delete(MODAL_PARAM_KEY);
        Array.from(next.keys())
            .filter((key) => key.startsWith(ADVANCED_MODE_PARAM_PREFIX))
            .forEach((key) => next.delete(key));

        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : (pathname ?? ''));
    };

    const setEntity = (nextEntity?: AdvancedModeEntity) => {
        const next = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );

        const params: Record<string, string | undefined> = {
            entityType: nextEntity?.type,
            entityId: nextEntity?.id,
            entitySubId: nextEntity?.entitySubId,
            entityTitle: nextEntity?.title,
            entityThumbnail: nextEntity?.thumbnail,
            page: undefined,
            pageSize: undefined,
            keyword: undefined,
            filters: undefined,
        };

        if (!nextEntity?.id || nextEntity.type === dataFilter.rankBy) {
            params.rankBy = undefined;
        }

        Object.entries(params).forEach(([key, value]) => {
            const paramKey = `${ADVANCED_MODE_PARAM_PREFIX}${key}`;
            if (value) {
                next.set(paramKey, value);
            } else {
                next.delete(paramKey);
            }
        });

        router.replace(`${pathname}?${next.toString()}`);
    };

    const updateFilters = (nextFilters: AnalyticsFilterItem[]) => {
        const next = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );

        if (nextFilters.length > 0) {
            next.set(filterParamKey, JSON.stringify(nextFilters));
        } else {
            next.delete(filterParamKey);
        }

        ['page', 'pageSize', 'keyword'].forEach((key) =>
            next.delete(`${ADVANCED_MODE_PARAM_PREFIX}${key}`)
        );

        router.replace(`${pathname}?${next.toString()}`);
    };

    const addFilter = (filter: AnalyticsFilterItem) => {
        const filtered = filters.filter((f) => f.type !== filter.type);
        updateFilters([...filtered, filter]);
    };

    const toggleFilter = (filter: AnalyticsFilterItem) => {
        const exists = filters.some(
            (f) => f.type === filter.type && f.id === filter.id
        );
        if (exists) {
            removeFilter(filter.type);
        } else {
            addFilter(filter);
        }
    };

    const removeFilter = (type: AnalyticsEntityType) => {
        updateFilters(filters.filter((f) => f.type !== type));
    };

    const clearAllFilters = () => {
        updateFilters([]);
    };

    const isFilterActive = (type: AnalyticsEntityType, id: string) => {
        return filters.some((f) => f.type === type && f.id === id);
    };

    const setDateRange = (fromDate: string, toDate: string) => {
        onChangeFilter({ fromDate, toDate }, false);
    };

    const setMetric = (metric: ANALYTICS_METRIC_KEY) => {
        onChangeFilter({ metric }, false);
    };

    const setRankBy = (nextRankBy?: AnalyticsEntityType | '') => {
        const next = new URLSearchParams(
            Array.from((searchParams ?? new URLSearchParams()).entries())
        );

        const rankByKey = `${ADVANCED_MODE_PARAM_PREFIX}rankBy`;
        if (nextRankBy) {
            next.set(rankByKey, nextRankBy);
        } else {
            next.delete(rankByKey);
        }

        ['page', 'pageSize', 'keyword'].forEach((key) =>
            next.delete(`${ADVANCED_MODE_PARAM_PREFIX}${key}`)
        );

        router.replace(`${pathname}?${next.toString()}`);
    };

    return {
        isOpen,
        entity,
        filters,
        fromDate: dataFilter.fromDate,
        toDate: dataFilter.toDate,
        metric: dataFilter.metric || ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
        rankBy: dataFilter.rankBy,
        openAdvancedMode,
        closeAdvancedMode,
        setEntity,
        setDateRange,
        setMetric,
        setRankBy,
        addFilter,
        toggleFilter,
        removeFilter,
        clearAllFilters,
        isFilterActive,
    };
}

