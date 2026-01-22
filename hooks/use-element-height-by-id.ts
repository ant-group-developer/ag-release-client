import { useLayoutEffect, useState } from 'react';

export function useElementHeightById(id: string) {
    const [height, setHeight] = useState(0);

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

        const ro = new ResizeObserver(updateHeight);
        ro.observe(el);

        return () => ro.disconnect();
    }, [id]);

    return height;
}
