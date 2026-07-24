import { ANALYTICS_RELEASE_TYPE } from '../enums';
import { ANALYTICS_VIEW_TYPE } from '../enums/tabs';

export const createViewMoreHref = (
    pathname: string,
    params: Record<string, any>
) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.set(key, String(value));
        }
    });

    return `${pathname}?${searchParams.toString()}`;
};

export const getAnalyticsViewType = (type: string | null) =>
    Object.values(ANALYTICS_VIEW_TYPE).includes(type as ANALYTICS_VIEW_TYPE)
        ? (type as ANALYTICS_VIEW_TYPE)
        : ANALYTICS_VIEW_TYPE.VIEW;

export const getAnalyticsReleaseType = (releaseType: string | null) =>
    Object.values(ANALYTICS_RELEASE_TYPE).includes(
        releaseType as ANALYTICS_RELEASE_TYPE
    )
        ? (releaseType as ANALYTICS_RELEASE_TYPE)
        : ANALYTICS_RELEASE_TYPE.ALL;

