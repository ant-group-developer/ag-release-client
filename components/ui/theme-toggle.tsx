import { SIZE_ICON } from '@/constants/common';
import { THEME } from '@/enums/common';
import { useThemeStore } from '@/hooks/use-theme-store';
import { Select } from 'antd';

// Bạn có thể cần import các icon từ @ant-design/icons
import { MonitorCog, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    width?: number;
};

export default function ThemeSelect({ width = 130 }: Props) {
    const { theme, toggleTheme } = useThemeStore();
    const messages = useTranslations();

    const options = [
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Sun size={SIZE_ICON} />

                    <span>{messages('theme.light')}</span>
                </p>
            ),
            value: THEME.LIGHT,
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Moon size={SIZE_ICON} />
                    <span>{messages('theme.dark')}</span>
                </p>
            ),
            value: THEME.DARK,
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <MonitorCog size={SIZE_ICON} />

                    <span>{messages('theme.system')}</span>
                </p>
            ),
            value: THEME.SYSTEM,
        },
    ];

    return (
        // <Button
        //     type="text"
        //     icon={theme === THEME.LIGHT ? <Moon /> : <Sun />}
        //     onClick={toggleTheme}
        // />
        <Select
            options={options}
            value={theme}
            onChange={toggleTheme}
            style={{ width }}
        />
    );
}
