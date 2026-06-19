import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { etlJobQueryKeys } from '../constants/query-keys';
import {
    DeleteImportedReleasesEventData,
    DeleteImportedReleasesEventType,
    EtlJobData,
    IMPORT_JOBS_STATUS,
} from '../types/payload';

const DELETE_REPORT_EVENTS_API_PATH = '/api/v1/report-import/releases/delete';

const getDeleteImportedReleaseEventsUrl = (jobId: string) => {
    return `${DELETE_REPORT_EVENTS_API_PATH}/${jobId}/events`;
};

const parseEventData = (
    eventType: string,
    eventData?: string
): DeleteImportedReleasesEventData => {
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
    eventData: DeleteImportedReleasesEventData
): Partial<EtlJobData> | undefined => {
    const hasFlatSummary =
        eventData.status !== undefined ||
        eventData.progress !== undefined ||
        eventData.rows !== undefined ||
        eventData.file !== undefined ||
        eventData.params !== undefined ||
        eventData.result !== undefined ||
        eventData.error !== undefined;

    if (!hasFlatSummary && !eventData.summary) return undefined;

    return {
        ...(eventData.summary || {}),
        ...(eventData.status !== undefined ? { status: eventData.status } : {}),
        ...(eventData.progress !== undefined
            ? { progress: eventData.progress }
            : {}),
        ...(eventData.rows !== undefined ? { rows: eventData.rows } : {}),
        ...(eventData.file !== undefined ? { file: eventData.file } : {}),
        ...(eventData.params !== undefined ? { params: eventData.params } : {}),
        ...(eventData.result !== undefined ? { result: eventData.result } : {}),
        ...(eventData.error !== undefined ? { error: eventData.error } : {}),
    };
};

const isCompletedEvent = (
    eventData: DeleteImportedReleasesEventData | null,
    summary: Partial<EtlJobData> | null
) => {
    return (
        eventData?.type === DeleteImportedReleasesEventType.COMPLETED ||
        eventData?.status === IMPORT_JOBS_STATUS.COMPLETED ||
        summary?.status === IMPORT_JOBS_STATUS.COMPLETED
    );
};

const isFailedEvent = (
    eventData: DeleteImportedReleasesEventData | null,
    summary: Partial<EtlJobData> | null
) => {
    return (
        eventData?.type === DeleteImportedReleasesEventType.FAILED ||
        eventData?.status === IMPORT_JOBS_STATUS.FAILED ||
        summary?.status === IMPORT_JOBS_STATUS.FAILED
    );
};

interface UseDeleteImportedReleaseEventsParams {
    jobId?: string | null;
    eventsUrl?: string | null;
    enabled?: boolean;
    onCompleted?: (eventData: DeleteImportedReleasesEventData) => void;
    onFailed?: (eventData: DeleteImportedReleasesEventData) => void;
}

export const useDeleteImportedReleaseEvents = ({
    jobId,
    eventsUrl,
    enabled = true,
    onCompleted,
    onFailed,
}: UseDeleteImportedReleaseEventsParams) => {
    const queryClient = useQueryClient();
    const [latestEvent, setLatestEvent] =
        useState<DeleteImportedReleasesEventData | null>(null);
    const [summary, setSummary] = useState<Partial<EtlJobData> | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const summaryRef = useRef<Partial<EtlJobData> | null>(null);
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
    }, [eventsUrl, jobId]);

    useEffect(() => {
        if ((!jobId && !eventsUrl) || !enabled) {
            setIsListening(false);
            return;
        }

        const abortController = new AbortController();
        const resolvedEventsUrl =
            eventsUrl || getDeleteImportedReleaseEventsUrl(jobId as string);

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
                        event.event || DeleteImportedReleasesEventType.PROGRESS,
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

                    if (isCompletedEvent(eventData, nextSummary)) {
                        isTerminalRef.current = true;
                        queryClient.invalidateQueries({
                            queryKey: etlJobQueryKeys.all,
                        });
                        onCompletedRef.current?.(eventData);
                        setIsListening(false);
                        abortController.abort();
                        return;
                    }

                    if (isFailedEvent(eventData, nextSummary)) {
                        isTerminalRef.current = true;
                        queryClient.invalidateQueries({
                            queryKey: etlJobQueryKeys.all,
                        });
                        onFailedRef.current?.(eventData);
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
    }, [enabled, eventsUrl, jobId, queryClient]);

    const isTerminalEvent = useMemo(() => {
        return (
            isCompletedEvent(latestEvent, summary) ||
            isFailedEvent(latestEvent, summary)
        );
    }, [latestEvent, summary]);

    return {
        latestEvent,
        summary,
        isListening,
        isTerminalEvent,
        error,
    };
};

export { getDeleteImportedReleaseEventsUrl, isCompletedEvent, isFailedEvent };
