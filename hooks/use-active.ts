import { useState } from 'react';

export const useActive = (state?: boolean) => {
    const [isActive, setIsActive] = useState(Boolean(state));

    function toggleActive() {
        setIsActive((prev) => !prev);
    }

    function active() {
        setIsActive(true);
    }

    function deActive() {
        setIsActive(false);
    }

    function changeActive(value: boolean) {
        setIsActive(value);
    }

    return { isActive, toggleActive, active, deActive, changeActive };
};
