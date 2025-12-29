// hooks/use-hash.ts
import { useEffect, useState } from 'react';

export function useHash() {
    const [hash, setHash] = useState('');

    useEffect(() => {
        // Set initial hash
        setHash(window.location.hash);

        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        // Listen to both hashchange and popstate
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        // Also check hash on any route change
        const observer = new MutationObserver(() => {
            if (window.location.hash !== hash) {
                setHash(window.location.hash);
            }
        });

        observer.observe(document, { subtree: true, childList: true });

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
            observer.disconnect();
        };
    }, []);

    return hash;
}
