import CreateButton from '@/components/ui/button/create-button';
import IconButton from '@/components/ui/button/icon-button';
import AppSearch from '@/components/ui/input/search';
import LocaleSelect from '@/components/ui/select/locale-select';
import ThemeToggle from '@/components/ui/theme-toggle';
import { TYPE_MODAL } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useTranslations } from 'next-intl';
import AppAvatar from './app-avatar';
import Logo from './app-logo';
import AppSearchModal from './app-search-modal';
import AppSupport from './app-support';

type Props = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const { Header: AntdHeader } = Layout;

function Header({ collapsed, toggleCollapsed }: Props) {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AntdHeader
            id="layout-header"
            className="dark:!bg-bg-dark flex items-center justify-between border-b !bg-white !pl-2 !pr-5 shadow-md dark:border-b-zinc-800"
        >
            <div className="flex flex-1 items-center gap-5">
                <IconButton onClick={toggleCollapsed} className="w-10 text-xl">
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </IconButton>
                <Logo />
            </div>

            <div className="flex flex-1 items-center gap-2">
                <AppSearch onClick={() => openModal(TYPE_MODAL.SEARCH)} />

                {typeModal === TYPE_MODAL.SEARCH && <AppSearchModal />}
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                <CreateButton canCreate text={messages('release.create')} />
                <LocaleSelect />
                <ThemeToggle />
                <AppSupport />
                <AppAvatar />
            </div>
        </AntdHeader>
    );
}

export default Header;
