import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getExportReportEventsUrl } from '../apis';
import {
    isExportReportCompleted,
    isExportReportFailed,
} from '../helpers/export-report-helper';
import {
    ExportReportEventData,
    ExportReportEventSummary,
    ExportReportEventType,
} from '../types';

const parseEventData = (
    eventType: string,
    eventData?: string
): ExportReportEventData => {
    const resolvedEventType =
        eventType && eventType !== ExportReportEventType.PROGRESS
            ? eventType
            : undefined;

    if (!eventData) {
        return { type: eventType };
    }

    try {
        const parsedData = JSON.parse(eventData);

        if (parsedData && typeof parsedData === 'object') {
            return {
                ...parsedData,
                type: resolvedEventType || parsedData.type || eventType,
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
    eventData: ExportReportEventData
): Partial<ExportReportEventSummary> | undefined => {
    const hasFlatSummary =
        eventData.status !== undefined ||
        eventData.progress !== undefined ||
        eventData.rows !== undefined ||
        eventData.file !== undefined ||
        eventData.result !== undefined ||
        eventData.error !== undefined;

    if (!hasFlatSummary && !eventData.summary) return undefined;

    const eventSummary: Partial<ExportReportEventSummary> = {
        ...(eventData.summary || {}),
    };

    if (eventData.status !== undefined) eventSummary.status = eventData.status;
    if (eventData.progress !== undefined) {
        eventSummary.progress = eventData.progress;
    }
    if (eventData.rows !== undefined) eventSummary.rows = eventData.rows;
    if (eventData.file !== undefined) eventSummary.file = eventData.file;
    if (eventData.result !== undefined) eventSummary.result = eventData.result;
    if (eventData.error !== undefined) eventSummary.error = eventData.error;

    return eventSummary;
};

interface UseExportAnalyticsReportEventsParams {
    jobId?: string | null;
    enabled?: boolean;
    onCompleted?: (eventData: ExportReportEventData) => void;
    onFailed?: (eventData: ExportReportEventData) => void;
}

export const useExportAnalyticsReportEvents = ({
    jobId,
    enabled = true,
    onCompleted,
    onFailed,
}: UseExportAnalyticsReportEventsParams) => {
    const [latestEvent, setLatestEvent] =
        useState<ExportReportEventData | null>(null);
    const [summary, setSummary] =
        useState<Partial<ExportReportEventSummary> | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const summaryRef = useRef<Partial<ExportReportEventSummary> | null>(null);
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
    }, [jobId]);

    useEffect(() => {
        if (!jobId || !enabled) {
            setIsListening(false);
            return;
        }

        const abortController = new AbortController();

        const listenEvents = async () => {
            if (isTerminalRef.current) return;

            setIsListening(true);
            setError(null);

            const session = (await getSession()) as {
                accessToken?: string;
            } | null;

            await fetchEventSource(getExportReportEventsUrl(jobId), {
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
                        event.event || ExportReportEventType.PROGRESS,
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

                    const isCompleted = isExportReportCompleted(
                        eventData,
                        nextSummary
                    );
                    const isFailed = isExportReportFailed(
                        eventData,
                        nextSummary
                    );

                    if (isCompleted) {
                        isTerminalRef.current = true;
                        onCompletedRef.current?.(eventData);
                        setIsListening(false);
                        abortController.abort();
                        return;
                    }

                    if (isFailed) {
                        isTerminalRef.current = true;
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
    }, [enabled, jobId]);

    const isTerminalEvent = useMemo(() => {
        return (
            isExportReportCompleted(latestEvent, summary) ||
            isExportReportFailed(latestEvent, summary)
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

export { getExportReportEventsUrl };
