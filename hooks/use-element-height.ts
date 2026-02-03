'use client';

import { useEffect, useState } from 'react';

export type ClassInput = string | string[];

function toSelector(input: ClassInput): string {
    const parts = Array.isArray(input) ? input : input.trim().split(/\s+/);
    const cleaned = parts.filter(Boolean).map((c) => c.replace(/^\./, ''));
    return '.' + cleaned.join('.');
}

export function useElementHeightByClass(
    className: ClassInput,
    rootParams?: ParentNode
) {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const root = rootParams || document;

        const selector = toSelector(className);
        let el = root.querySelector<HTMLElement>(selector);
        if (el) {
            setHeight(el.getBoundingClientRect().height);
        }

        // Watch for it to appear/change
        const update = () => {
            el = root.querySelector<HTMLElement>(selector);
            if (el) setHeight(el.getBoundingClientRect().height);
        };

        const mo = new MutationObserver(update);
        mo.observe(root === document ? document.body : (root as Element), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class'],
        });

        // Also observe size changes if/when it exists
        let ro: ResizeObserver | null = null;
        if (el) {
            ro = new ResizeObserver(update);
            ro.observe(el);
        }

        // Re-wire ResizeObserver whenever the target changes
        const rewire = () => {
            const found = root.querySelector<HTMLElement>(selector);
            if (found && found !== el) {
                ro?.disconnect();
                el = found;
                ro = new ResizeObserver(update);
                ro.observe(el);
                update();
            }
        };
        const mo2 = new MutationObserver(rewire);
        mo2.observe(root === document ? document.body : (root as Element), {
            childList: true,
            subtree: true,
        });

        window.addEventListener('resize', update);
        update();

        return () => {
            mo.disconnect();
            mo2.disconnect();
            ro?.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [className, rootParams]);

    return height;
}
