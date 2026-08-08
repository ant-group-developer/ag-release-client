import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    assetImportBatchQueryKeys,
    assetImportItemQueryKeys,
} from '../constants/query-keys';
import {
    AssetImportBatchStatus,
    TERMINAL_ASSET_IMPORT_BATCH_STATUSES,
} from '../enums';
import { AssetImportBatchData } from '../types';
import { AssetImportEventData, AssetImportEventType } from '../types/payload';

const getAssetImportEventsUrl = (batchId: string) =>
    `/api/v1/asset-import/batches/${batchId}/events`;

const parseEventData = (
    eventType: string,
    eventData?: string
): AssetImportEventData => {
    if (!eventData) {
        return { type: eventType };
    }

    try {
        const parsedData = JSON.parse(eventData);

        if (parsedData && typeof parsedData === 'object') {
            return {
                ...parsedData,
                type: parsedData.type || eventType,
            };
        }

        return {
            type: eventType,
            message: String(parsedData),
        };
    } catch {
        return {
            type: eventType,
            message: eventData,
        };
    }
};

const getEventSummary = (
    eventData: AssetImportEventData
): Partial<AssetImportBatchData> | undefined => {
    const hasFlatSummary =
        eventData.status !== undefined ||
        eventData.totalRows !== undefined ||
        eventData.matchedRows !== undefined ||
        eventData.appliedRows !== undefined ||
        eventData.failedRows !== undefined ||
        eventData.errorMessage !== undefined;

    if (!hasFlatSummary && !eventData.summary) return undefined;

    return {
        ...(eventData.summary || {}),
        ...(eventData.status !== undefined ? { status: eventData.status } : {}),
        ...(eventData.totalRows !== undefined
            ? { totalRows: eventData.totalRows }
            : {}),
        ...(eventData.matchedRows !== undefined
            ? { matchedRows: eventData.matchedRows }
            : {}),
        ...(eventData.appliedRows !== undefined
            ? { appliedRows: eventData.appliedRows }
            : {}),
        ...(eventData.failedRows !== undefined
            ? { failedRows: eventData.failedRows }
            : {}),
        ...(eventData.errorMessage !== undefined
            ? { errorMessage: eventData.errorMessage }
            : {}),
    };
};

const isTerminalEventData = (
    eventData: AssetImportEventData | null,
    summary: Partial<AssetImportBatchData> | null
) => {
    const status = (eventData?.status || summary?.status) as
        | AssetImportBatchStatus
        | undefined;

    return (
        eventData?.type === AssetImportEventType.COMPLETED ||
        eventData?.type === AssetImportEventType.FAILED ||
        eventData?.type === AssetImportEventType.CANCELLED ||
        (!!status && TERMINAL_ASSET_IMPORT_BATCH_STATUSES.includes(status))
    );
};

const isFailedEventData = (
    eventData: AssetImportEventData | null,
    summary: Partial<AssetImportBatchData> | null
) => {
    const status = eventData?.status || summary?.status;

    return (
        eventData?.type === AssetImportEventType.FAILED ||
        status === AssetImportBatchStatus.FAILED
    );
};

interface UseAssetImportBatchEventsParams {
    batchId?: string | null;
    enabled?: boolean;
    onCompleted?: (eventData: AssetImportEventData) => void;
    onFailed?: (eventData: AssetImportEventData) => void;
}

export const useAssetImportBatchEvents = ({
    batchId,
    enabled = true,
    onCompleted,
    onFailed,
}: UseAssetImportBatchEventsParams) => {
    const queryClient = useQueryClient();
    const [latestEvent, setLatestEvent] =
        useState<AssetImportEventData | null>(null);
    const [summary, setSummary] = useState<Partial<AssetImportBatchData> | null>(
        null
    );
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const summaryRef = useRef<Partial<AssetImportBatchData> | null>(null);
    const isTerminalRef = useRef(false);
    const onCompletedRef = useRef(onCompleted);
    const onFailedRef = useRef(onFailed);

    useEffect(() => {
        onCompletedRef.current = onCompleted;
        onFailedRef.current = onFailed;
    }, [onCompleted, onFailed]);

    useEffect(() => {
        summaryRef.current = null;
        isTerminalRef.current = false;
        setSummary(null);
        setLatestEvent(null);
        setError(null);
    }, [batchId]);

    useEffect(() => {
        if (!batchId || !enabled) {
            setIsListening(false);
            return;
        }

        const abortController = new AbortController();
        const resolvedEventsUrl = getAssetImportEventsUrl(batchId);

        const listenEvents = async () => {
            if (isTerminalRef.current) return;

            setIsListening(true);
            setError(null);

            const session = (await getSession()) as {
                accessToken?: string;
            } | null;

            await fetchEventSource(resolvedEventsUrl, {
                method: 'GET',
                signal: abortController.signal,
                openWhenHidden: true,
                headers: {
                    Accept: 'text/event-stream',
                    ...(session?.accessToken
                        ? { Authorization: `Bearer ${session.accessToken}` }
                        : {}),
                },
                onmessage: (event) => {
                    const eventData = parseEventData(
                        event.event || AssetImportEventType.PROGRESS,
                        event.data
                    );
                    const eventSummary = getEventSummary(eventData);

                    setLatestEvent(eventData);

                    let nextSummary = summaryRef.current;
                    if (eventSummary) {
                        nextSummary = {
                            ...(summaryRef.current || {}),
                            ...eventSummary,
                        };
                        summaryRef.current = nextSummary;
                        setSummary(nextSummary);
                    }

                    if (isTerminalEventData(eventData, nextSummary)) {
                        isTerminalRef.current = true;
                        queryClient.invalidateQueries({
                            queryKey: assetImportBatchQueryKeys.all,
                        });
                        queryClient.invalidateQueries({
                            queryKey: assetImportItemQueryKeys.all,
                        });

                        if (isFailedEventData(eventData, nextSummary)) {
                            onFailedRef.current?.(eventData);
                        } else {
                            onCompletedRef.current?.(eventData);
                        }

                        setIsListening(false);
                        abortController.abort();
                    }
                },
                onclose: () => {
                    setIsListening(false);
                },
                onerror: (err) => {
                    if (
                        abortController.signal.aborted ||
                        isTerminalRef.current
                    ) {
                        setIsListening(false);
                        return;
                    }

                    const nextError =
                        err instanceof Error ? err : new Error(String(err));
                    setError(nextError);
                    setIsListening(false);
                    throw nextError;
                },
            });
        };

        listenEvents().catch((err) => {
            if (!abortController.signal.aborted) {
                const nextError =
                    err instanceof Error ? err : new Error(String(err));
                setError(nextError);
                setIsListening(false);
            }
        });

        return () => {
            abortController.abort();
            setIsListening(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, batchId, queryClient]);

    const isTerminalEvent = useMemo(
        () => isTerminalEventData(latestEvent, summary),
        [latestEvent, summary]
    );

    return {
        latestEvent,
        summary,
        isListening,
        isTerminalEvent,
        error,
    };
};

export { getAssetImportEventsUrl };
