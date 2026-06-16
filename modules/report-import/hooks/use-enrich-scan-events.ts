import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { enrichScanSessionQueryKeys } from '../constants/query-keys';
import {
    EnrichScanEventData,
    EnrichScanEventType,
    EnrichScanSummary,
} from '../types/payload';

const ENRICH_SCAN_EVENTS_API_PATH = '/api/v1/partners/enrich/scan';

const getEnrichScanEventsUrl = (scanId: string) => {
    return `${ENRICH_SCAN_EVENTS_API_PATH}/${scanId}/events`;
};

const parseEventData = (
    eventType: string,
    eventData?: string
): EnrichScanEventData => {
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

const getEventSummary = (eventData: EnrichScanEventData) => {
    if (eventData.summary || eventData.progress) {
        return eventData.summary || eventData.progress;
    }

    const hasFlatSummary =
        eventData.status !== undefined ||
        eventData.totalReleases !== undefined ||
        eventData.processedReleases !== undefined ||
        eventData.successCount !== undefined ||
        eventData.failedCount !== undefined ||
        eventData.notFoundCount !== undefined ||
        eventData.errorMessage !== undefined;

    return hasFlatSummary
        ? {
              status: eventData.status,
              totalReleases: eventData.totalReleases,
              processedReleases: eventData.processedReleases,
              successCount: eventData.successCount,
              failedCount: eventData.failedCount,
              notFoundCount: eventData.notFoundCount,
              errorMessage: eventData.errorMessage,
          }
        : undefined;
};

interface UseEnrichScanEventsParams {
    scanId?: string | null;
    enabled?: boolean;
    onCompleted?: (eventData: EnrichScanEventData) => void;
    onFailed?: (eventData: EnrichScanEventData) => void;
}

export const useEnrichScanEvents = ({
    scanId,
    enabled = true,
    onCompleted,
    onFailed,
}: UseEnrichScanEventsParams) => {
    const queryClient = useQueryClient();
    const [latestEvent, setLatestEvent] = useState<EnrichScanEventData | null>(
        null
    );
    const [summary, setSummary] = useState<Partial<EnrichScanSummary> | null>(
        null
    );
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setSummary(null);
        setLatestEvent(null);
        setError(null);
    }, [scanId]);

    useEffect(() => {
        if (!scanId || !enabled) {
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

            await fetchEventSource(getEnrichScanEventsUrl(scanId), {
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
                        event.event || EnrichScanEventType.PROGRESS,
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

                    if (eventData.type === EnrichScanEventType.COMPLETED) {
                        queryClient.invalidateQueries({
                            queryKey: enrichScanSessionQueryKeys.all,
                        });
                        onCompleted?.(eventData);
                        abortController.abort();
                    }

                    if (eventData.type === EnrichScanEventType.FAILED) {
                        queryClient.invalidateQueries({
                            queryKey: enrichScanSessionQueryKeys.all,
                        });
                        onFailed?.(eventData);
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
    }, [enabled, onCompleted, onFailed, queryClient, scanId]);

    const isTerminalEvent = useMemo(() => {
        return (
            latestEvent?.type === EnrichScanEventType.COMPLETED ||
            latestEvent?.type === EnrichScanEventType.FAILED
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

export { getEnrichScanEventsUrl };
