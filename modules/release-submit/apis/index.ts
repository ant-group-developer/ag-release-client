import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    ReleaseSubmitData,
    ReleaseSubmitFilter,
    ReleaseSubmitPaginationResponse,
} from '../types';

const compactObject = <T extends Record<string, unknown>>(value: T) =>
    Object.entries(value).reduce((result, [key, item]) => {
        if (
            item !== undefined &&
            item !== null &&
            item !== '' &&
            (!Array.isArray(item) || item.length > 0)
        ) {
            result[key as keyof T] = item as T[keyof T];
        }
        return result;
    }, {} as Partial<T>);

const mapReleaseExecution3Params = (params: ReleaseSubmitFilter) => {
    const { queryListReleases, type, latestOnly, ...executionParams } = params;

    const queryListReleasesParams = compactObject({
        ...queryListReleases,
        isImportedFromReport:
            queryListReleases?.isImportedFromReport === 'all'
                ? undefined
                : queryListReleases?.isImportedFromReport,
    });

    return compactObject({
        ...executionParams,
        latestOnly: latestOnly === 'all' ? undefined : latestOnly,
        queryListReleases:
            Object.keys(queryListReleasesParams).length > 0
                ? queryListReleasesParams
                : undefined,
    });
};

const serializeParams = (params: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();

    const appendParam = (key: string, value: unknown) => {
        if (value === undefined || value === null || value === '') return;

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey =
                    item && typeof item === 'object'
                        ? `${key}[${index}]`
                        : `${key}[]`;
                appendParam(arrayKey, item);
            });
            return;
        }

        if (value && typeof value === 'object') {
            Object.entries(value as Record<string, unknown>).forEach(
                ([childKey, childValue]) => {
                    appendParam(`${key}[${childKey}]`, childValue);
                }
            );
            return;
        }

        searchParams.append(key, String(value));
    };

    Object.entries(params).forEach(([key, value]) => {
        appendParam(key, value);
    });

    return searchParams.toString();
};

export const releaseSubmitApis = {
    getList: (params: ReleaseSubmitFilter) => {
        return axiosInstance.get<ReleaseSubmitPaginationResponse>(
            '/release-executions3',
            {
                params: mapReleaseExecution3Params(params),
                paramsSerializer: {
                    serialize: serializeParams,
                },
            }
        );
    },
    getDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<ReleaseSubmitData>>(
            `/release-executions3/${id}`
        );
    },
    retryStep: (stepId: string) => {
        return axiosInstance.post(`/release-executions3/steps/${stepId}/retry`);
    },
};
