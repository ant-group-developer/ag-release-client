import CreateButton from '@/components/ui/button/create-button';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON_BIG } from '@/constants/common';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import TenantSwitch from '@/modules/tenant/components/tenant-switch';
import { Layout } from 'antd';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AppAvatar from './app-avatar';
import AppSupport from './app-support';

type Props = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const { Header: AntdHeader } = Layout;

function Header({ collapsed, toggleCollapsed }: Props) {
    const messages = useTranslations();
    const { isNotSystemTenant } = useAuth();

    return (
        <AntdHeader
            id="layout-header"
            className="flex items-center justify-between border-b !bg-white !pl-2 !pr-5 shadow-md dark:border-b-zinc-800 dark:!bg-bg-dark"
        >
            <div className="flex flex-1 items-center gap-5">
                <IconButton onClick={toggleCollapsed}>
                    <Menu size={SIZE_ICON_BIG} />
                </IconButton>
                <div className="hidden md:block">
                    <TenantSwitch />
                </div>
            </div>

            {/* <div className="flex max-w-[400px] flex-1 items-center">
                <AppSearch
                    onClick={() => openModal(TYPE_MODAL.SEARCH)}
                    onSearch={() => openModal(TYPE_MODAL.SEARCH)}
                />

                {typeModal === TYPE_MODAL.SEARCH && <AppSearchModal />}
            </div> */}

            <div className="flex flex-1 items-center justify-end gap-2">
                {isNotSystemTenant && (
                    <Link href={'/releases/create'}>
                        <CreateButton
                            canCreate
                            text={messages('release.create')}
                        />
                    </Link>
                )}
                <AppSupport />
                <AppAvatar />
            </div>
        </AntdHeader>
    );
}

export default Header;
