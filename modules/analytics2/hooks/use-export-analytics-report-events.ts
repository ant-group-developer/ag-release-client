import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getSession } from 'next-auth/react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { getExportReportEventsUrl } from '../apis';
import { ExportReportEventData, ExportReportEventType, ExportReportEventSummary } from '../types';

const parseEventData = (
    eventType: string,
    eventData?: string
): ExportReportEventData => {
    if (!eventData) {
        return { type: eventType };
    }

    try {
        const parsedData = JSON.parse(eventData);

        if (parsedData && typeof parsedData === 'object') {
            return {
                type: parsedData.type || eventType,
                ...parsedData,
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

const getEventSummary = (eventData: ExportReportEventData): Partial<ExportReportEventSummary> | undefined => {
    const hasFlatSummary =
        eventData.status !== undefined ||
        eventData.progress !== undefined ||
        eventData.rows !== undefined ||
        eventData.file !== undefined ||
        eventData.result !== undefined ||
        eventData.error !== undefined;

    return hasFlatSummary
        ? {
              status: eventData.status,
              progress: eventData.progress,
              rows: eventData.rows,
              file: eventData.file,
              result: eventData.result,
              error: eventData.error,
          }
        : undefined;
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
    const [latestEvent, setLatestEvent] = useState<ExportReportEventData | null>(
        null
    );
    const [summary, setSummary] = useState<Partial<ExportReportEventSummary> | null>(
        null
    );
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onCompletedRef = useRef(onCompleted);
    const onFailedRef = useRef(onFailed);

    useEffect(() => {
        onCompletedRef.current = onCompleted;
        onFailedRef.current = onFailed;
    }, [onCompleted, onFailed]);

    useEffect(() => {
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

                    if (eventSummary) {
                        setSummary((prev) => ({
                            ...(prev || {}),
                            ...eventSummary,
                        }));
                    }

                    if (eventData.type === ExportReportEventType.COMPLETED) {
                        onCompletedRef.current?.(eventData);
                        setIsListening(false);
                        abortController.abort();
                    }

                    if (eventData.type === ExportReportEventType.FAILED) {
                        onFailedRef.current?.(eventData);
                        setIsListening(false);
                        abortController.abort();
                    }
                },
                onclose: () => {
                    setIsListening(false);
                },
                onerror: (err) => {
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
            latestEvent?.type === ExportReportEventType.COMPLETED ||
            latestEvent?.type === ExportReportEventType.FAILED
        );
    }, [latestEvent?.type]);

    return {
        latestEvent,
        summary,
        isListening,
        isTerminalEvent,
        error,
    };
};

export { getExportReportEventsUrl };
