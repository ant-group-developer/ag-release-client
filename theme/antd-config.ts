import { defaultConfig } from '@/constants/env';
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        // colorPrimary: '#ff4757',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        colorText: defaultConfig.TEXT_COLOR,
        // fontSize: 13,
        colorLink: defaultConfig.TEXT_COLOR,
        colorLinkHover: '#1677ff',
        colorLinkActive: '#1677ff',
    },
};

export default theme;
