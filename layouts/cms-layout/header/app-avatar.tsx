import { SIZE_ICON } from '@/constants/common';
import { LOCALE, THEME } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { getAvatarPlaceholder } from '@/helpers/common';
import { useLocale } from '@/hooks/use-locale';
import { useThemeStore } from '@/hooks/use-theme-store';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { Check, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

function AppAvatar({}: Props) {
    const { profile, logout } = useAuth();
    const messages = useTranslations();
    const router = useRouter();
    const avatarPlaceholder = getAvatarPlaceholder(profile?.name);
    const { theme, setTheme } = useThemeStore();
    const { locale, switchLocale } = useLocale();

    const currentLocale = locale === LOCALE.VI ? 'Việt Nam' : 'English';

    const themeIntl =
        theme === 'dark' ? messages('common.dark') : messages('common.light');

    const items: ItemType[] = [
        {
            label: (
                <div
                    onClick={() => router.push(APP_ROUTES.USER)}
                    className="mb-2 flex max-w-xs items-center text-base"
                >
                    <Avatar
                        size={40}
                        className="!bg-primary flex-none cursor-pointer"
                    >
                        {avatarPlaceholder}
                    </Avatar>
                    <div className="ml-3 truncate">
                        <p className="truncate font-bold">{profile.name}</p>
                        <p className="truncate text-sm">{profile?.email}</p>
                    </div>
                </div>
            ),
            key: '1',
        },
        {
            label: (
                <div className="flex w-[250px] items-center justify-between pl-2 text-sm">
                    <span className="font-bold">
                        {messages('common.displayMode')}
                    </span>
                    <span> {themeIntl} </span>
                </div>
            ),
            key: '2',
            children: [
                {
                    label: (
                        <p className="flex w-[250px] items-center justify-between">
                            <span>{messages('common.light')}</span>
                            {theme == THEME.LIGHT && <Check size={SIZE_ICON} />}
                        </p>
                    ),
                    key: '2.1',
                    onClick: () => setTheme(THEME.LIGHT),
                },
                {
                    label: (
                        <p className="flex w-[250px] items-center justify-between">
                            {messages('common.dark')}
                            {theme === THEME.DARK && <Check size={SIZE_ICON} />}
                        </p>
                    ),
                    key: '2.2',
                    onClick: () => setTheme(THEME.DARK),
                },
                {
                    label: (
                        <p className="flex w-[250px] items-center justify-between">
                            {messages('common.system')}
                            {theme == THEME.SYSTEM && (
                                <Check size={SIZE_ICON} />
                            )}
                        </p>
                    ),
                    key: '2.3',
                    onClick: () => setTheme(THEME.SYSTEM),
                },
            ],
        },
        {
            label: (
                <div className="flex items-center justify-between gap-2 pl-2 text-sm">
                    <span className="font-bold">
                        {messages('language.label')}
                    </span>
                    <span>{currentLocale}</span>
                </div>
            ),
            key: '3',
            children: [
                {
                    label: (
                        <p className="flex w-[250px] items-center justify-between">
                            {messages('language.vietnamese')}
                            {locale === LOCALE.VI && <Check size={SIZE_ICON} />}
                        </p>
                    ),
                    key: '3.1',
                    onClick: () => switchLocale(LOCALE.VI),
                },
                {
                    label: (
                        <p className="flex w-[250px] items-center justify-between">
                            {messages('language.english')}
                            {locale === LOCALE.EN && <Check size={SIZE_ICON} />}
                        </p>
                    ),
                    key: '3.2',
                    onClick: () => switchLocale(LOCALE.EN),
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div className="flex items-center gap-2 pl-2 text-base text-red-600">
                    <LogOut />
                    {messages('userProfile.logout')}
                </div>
            ),
            key: '4',
        },
    ];

    function onClick({ key }: { key: string }) {
        if (key === '4') {
            logout();
        }
    }
    return (
        <Dropdown trigger={['click']} menu={{ items, onClick }}>
            <Avatar size={40} className="cursor-pointer !bg-blue-500">
                {avatarPlaceholder}
            </Avatar>
        </Dropdown>
    );
}

export default AppAvatar;
