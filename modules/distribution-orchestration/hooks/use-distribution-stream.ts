import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { TimelineEvent } from '../types';

const STREAM_BASE = '/api/v1/distributions';
const getStreamUrl = (id: string) => `${STREAM_BASE}/${id}/stream`;

/** Heartbeat server gửi mỗi 30s để giữ kết nối — bỏ qua, không phải event nghiệp vụ. */
const KEEPALIVE = 'keepalive';

interface Params {
    distributionId?: string | null;
    enabled?: boolean;
    /** Gọi mỗi event mới (đã parse). */
    onEvent?: (event: TimelineEvent) => void;
}

/**
 * SSE `/distributions/:id/stream` — nhận event realtime.
 *
 * Dựa trên pattern `use-enrich-scan-events`. `fetchEventSource` cho phép
 * đính kèm header Authorization (EventSource gốc không) — server có global
 * JwtAuthGuard nên gắn Bearer từ next-auth session.
 * Tự invalidate timeline query khi có event mới → list history refetch.
 */
export const useDistributionStream = ({
    distributionId,
    enabled = true,
    onEvent,
}: Params) => {
    const queryClient = useQueryClient();
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [latestEvent, setLatestEvent] = useState<TimelineEvent | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const onEventRef = useRef(onEvent);
    onEventRef.current = onEvent;

    // reset khi đổi distribution
    useEffect(() => {
        setEvents([]);
        setLatestEvent(null);
        setError(null);
    }, [distributionId]);

    useEffect(() => {
        if (!distributionId || !enabled) {
            setIsListening(false);
            return;
        }

        const abortController = new AbortController();

        const listen = async () => {
            setIsListening(true);
            setError(null);

            const session = (await getSession()) as {
                accessToken?: string;
            } | null;

            await fetchEventSource(getStreamUrl(distributionId), {
                method: 'GET',
                signal: abortController.signal,
                openWhenHidden: true,
                headers: {
                    Accept: 'text/event-stream',
                    ...(session?.accessToken
                        ? { Authorization: `Bearer ${session.accessToken}` }
                        : {}),
                },
                onmessage: (msg) => {
                    if (msg.event === KEEPALIVE || !msg.data) return;

                    let parsed: TimelineEvent | null = null;
                    try {
                        parsed = JSON.parse(msg.data) as TimelineEvent;
                    } catch {
                        return; // data không phải JSON hợp lệ → bỏ qua
                    }
                    if (!parsed) return;

                    setLatestEvent(parsed);
                    // dedupe theo id (SSE có thể trùng khi reconnect)
                    setEvents((prev) =>
                        prev.some((e) => e.id === parsed!.id)
                            ? prev
                            : [...prev, parsed!]
                    );
                    onEventRef.current?.(parsed);

                    queryClient.invalidateQueries({
                        queryKey: [
                            ...distributionOrchestrationQueryKeys.timelines(),
                            distributionId,
                        ],
                    });
                },
                onclose: () => setIsListening(false),
                onerror: (err) => {
                    const next =
                        err instanceof Error ? err : new Error(String(err));
                    setError(next);
                    setIsListening(false);
                    throw next; // dừng retry vô hạn của fetchEventSource
                },
            });
        };

        listen().catch((err) => {
            if (!abortController.signal.aborted) {
                setError(err instanceof Error ? err : new Error(String(err)));
                setIsListening(false);
            }
        });

        return () => {
            abortController.abort();
            setIsListening(false);
        };
    }, [distributionId, enabled, queryClient]);

    const reset = useCallback(() => {
        setEvents([]);
        setLatestEvent(null);
        setError(null);
    }, []);

    return { events, latestEvent, isListening, error, reset };
};

export { getStreamUrl };
