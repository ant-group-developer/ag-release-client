import { SIZE_ICON } from '@/constants/common';
import { LOCALE, THEME } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { getAvatarPlaceholder } from '@/helpers/common';
import { useLocale } from '@/hooks/use-locale';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { theme as antdTheme, Avatar, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { LogOut, MonitorCog, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {};

function AppAvatar({}: Props) {
    const { profile, logout } = useAuth();
    const messages = useTranslations();
    const router = useRouter();
    const avatarPlaceholder = getAvatarPlaceholder(profile?.name);
    const { themeMode, setThemeMode } = useThemeMode();
    const { locale, switchLocale } = useLocale();

    const { token } = antdTheme.useToken();

    const currentLocale = locale === LOCALE.VI ? 'Tiếng việt' : 'English';

    let themeIntl = '';
    switch (themeMode) {
        case 'light':
            themeIntl = messages('common.light');
            break;
        case 'dark':
            themeIntl = messages('common.dark');
            break;
        case 'system':
            themeIntl = messages('common.system');
            break;
        default:
            break;
    }

    const items: ItemType[] = [
        {
            label: (
                <div
                    onClick={() => router.push(APP_ROUTES.USER)}
                    className="mb-2 flex max-w-xs items-center text-base"
                >
                    <Avatar
                        size={40}
                        className="flex-none cursor-pointer"
                        src={profile.avatar}
                    >
                        {avatarPlaceholder}
                    </Avatar>
                    <div className="ml-3 truncate">
                        <p className="truncate font-semibold">{profile.name}</p>
                        <p className="truncate text-sm">{profile?.email}</p>
                    </div>
                </div>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div
                    className="flex w-[250px] items-center justify-between pl-2 text-sm"
                    style={{
                        color: token.colorText,
                    }}
                >
                    <span className="font-semibold">
                        {messages('common.displayMode')}
                    </span>
                    <span> {themeIntl} </span>
                </div>
            ),
            key: '2',
            children: [
                {
                    type: 'group',
                    label: messages('common.settingNote'),
                    key: '2.0',
                },
                {
                    label: messages('common.light'),
                    key: THEME.LIGHT,
                    icon: <Sun size={SIZE_ICON} />,
                    onClick: () => setThemeMode(THEME.LIGHT),
                },
                {
                    label: messages('common.dark'),
                    key: THEME.DARK,
                    icon: <Moon size={SIZE_ICON} />,
                    onClick: () => setThemeMode(THEME.DARK),
                },
                {
                    label: messages('common.system'),
                    key: THEME.SYSTEM,
                    icon: <MonitorCog size={SIZE_ICON} />,
                    onClick: () => setThemeMode(THEME.SYSTEM),
                },
            ],
        },
        {
            label: (
                <div
                    className="flex items-center justify-between gap-2 pl-2 text-sm"
                    style={{
                        color: token.colorText,
                    }}
                >
                    <span className="font-semibold">
                        {messages('language.label')}
                    </span>
                    <span>{currentLocale}</span>
                </div>
            ),
            key: '3',
            children: [
                {
                    type: 'group',
                    label: <p>{messages('common.settingNote')}</p>,
                    key: '3.0',
                },
                {
                    label: (
                        <p className="flex min-w-[250px] items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Image
                                    height={15}
                                    width={30}
                                    src={'/languages/vi.svg'}
                                    alt={LOCALE.VI}
                                />
                                {messages('language.vietnamese')}
                            </div>
                            {/* {locale === LOCALE.VI && <Check size={SIZE_ICON} />} */}
                        </p>
                    ),
                    key: LOCALE.VI,
                    onClick: () => switchLocale(LOCALE.VI),
                },
                {
                    label: (
                        <p className="flex min-w-[250px] items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Image
                                    height={15}
                                    width={30}
                                    src={'/languages/en.svg'}
                                    alt={LOCALE.EN}
                                />
                                {messages('language.english')}
                            </div>
                            {/* {locale === LOCALE.EN && <Check size={SIZE_ICON} />} */}
                        </p>
                    ),
                    key: LOCALE.EN,
                    onClick: () => switchLocale(LOCALE.EN),
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div className="flex items-center gap-2 pl-2">
                    <LogOut size={14} />
                    {messages('userProfile.logout')}
                </div>
            ),
            key: '4',
            onClick: () => logout(),
        },
    ];

    return (
        <Dropdown
            trigger={['click']}
            menu={{ items, selectedKeys: [themeMode, locale] }}
        >
            <Avatar size={40} className="cursor-pointer" src={profile.avatar}>
                {avatarPlaceholder}
            </Avatar>
        </Dropdown>
    );
}

export default AppAvatar;
