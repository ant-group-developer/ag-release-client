import IconButton from '@/components/ui/button/icon-button';
import LocaleSelect from '@/components/ui/select/locale-select';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import AppAvatar from './app-avatar';
import AppGuide from './app-guide';
import Logo from './app-logo';
import AppSupport from './app-support';

type Props = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const { Header: AntdHeader } = Layout;

function Header({ collapsed, toggleCollapsed }: Props) {
    return (
        <AntdHeader
            id="layout-header"
            className="flex items-center justify-between border-b !bg-white !pl-2 !pr-5 shadow-md"
        >
            <div className="flex items-center gap-5">
                <IconButton onClick={toggleCollapsed} className="w-10 text-xl">
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </IconButton>
                <Logo />
            </div>
            <div className="flex items-center justify-end gap-2">
                <LocaleSelect />
                <AppGuide />
                <AppSupport />
                <AppAvatar />
            </div>
        </AntdHeader>
    );
}

export default Header;
