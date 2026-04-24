import { useLayoutEffect, useRef, useState } from 'react';

export function useElementHeightById(id: string, debounceMs = 50) {
    const [height, setHeight] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useLayoutEffect(() => {
        const el = document.getElementById(id);
        if (!el) return;

        let prev = -1;

        const updateHeight = () => {
            const next = Math.round(el.getBoundingClientRect().height);
            if (next !== prev) {
                prev = next;
                setHeight(next);
            }
        };

        updateHeight(); // đo lần đầu

        const debouncedUpdate = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(updateHeight, debounceMs);
        };

        const ro = new ResizeObserver(debouncedUpdate);
        ro.observe(el);

        return () => {
            ro.disconnect();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [id, debounceMs]);

    return height;
}
