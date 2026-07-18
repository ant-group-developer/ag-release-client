import { useEffect, useState } from 'react';

export function useCurrentDomain() {
    const [domain, setDomain] = useState('');

    useEffect(() => {
        setDomain(window.location.hostname);
    }, []);

    return domain;
}
