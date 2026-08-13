import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export function useIsMobile() {
    const screens = useBreakpoint();
    return screens.md === false;
}

export default useIsMobile;
