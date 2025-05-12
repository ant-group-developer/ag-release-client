import { APP_ROUTES } from '@/enums/routes';
import { getAvatarPlaceholder } from '@/helpers/common';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

function AppAvatar({}: Props) {
    const { profile, logout } = useAuth();
    const messages = useTranslations();
    const router = useRouter();

    const avatarPlaceholder = getAvatarPlaceholder(profile?.name);

    const items: ItemType[] = [
        {
            label: (
                <div
                    onClick={() => router.push(APP_ROUTES.USER)}
                    className="flex max-w-xs items-center text-base"
                >
                    <Avatar
                        size={40}
                        className="!bg-primary flex-none cursor-pointer"
                    >
                        {avatarPlaceholder}
                    </Avatar>
                    <div className="ml-3 truncate">
                        <p className="truncate">{profile.name}</p>
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
                <div className="flex items-center gap-2 pl-2 text-base text-red-600">
                    {' '}
                    <LogOut />
                    {messages('userProfile.logout')}
                </div>
            ),
            key: '3',
        },
    ];

    function onClick({ key }: { key: string }) {
        if (key === '3') {
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
