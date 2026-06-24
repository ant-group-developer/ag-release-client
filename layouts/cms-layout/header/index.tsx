import CreateButton from '@/components/ui/button/create-button';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON_BIG } from '@/constants/common';
import { toastPromise } from '@/helpers/messages-helper';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useDownloadTemplate } from '@/modules/releases/hooks/use-download-template';
import TenantSwitch from '@/modules/tenant/components/tenant-switch';
import { DownloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, MenuProps, Space } from 'antd';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import AppAvatar from './app-avatar';
import AppSupport from './app-support';

type Props = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const { Header: AntdHeader } = Layout;

function Header({ toggleCollapsed }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const { isNotSystemTenant } = useAuth();
    const { mutateAsync: downloadTemplate } = useDownloadTemplate();
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);

    const handleDownloadTemplate = () => {
        const promise = downloadTemplate();
        toastPromise(promise, messages, {
            success: messages('common.success'),
            error: messages('common.error'),
        });
    };

    const dropdownOptions: MenuProps['items'] = [
        {
            label: messages('release.downloadTemplate'),
            key: 'download-template',
            icon: <DownloadOutlined />,
            onClick: () => {
                handleDownloadTemplate();
            },
        },
    ];

    return (
        <AntdHeader
            id="layout-header"
            className="flex !h-16 items-center justify-between border-b !bg-white !pl-2 !pr-5 shadow-md dark:border-b-zinc-800 dark:!bg-bg-dark"
        >
            <div className="flex flex-1 items-center gap-5">
                <IconButton onClick={toggleCollapsed}>
                    <Menu size={SIZE_ICON_BIG} />
                </IconButton>
                <div className="hidden md:block">
                    <TenantSwitch />
                </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                {isNotSystemTenant && (
                    <PermissionGate
                        anyOf={[
                            PERMISSION.RELEASE_AUDIO.CREATE,
                            PERMISSION.RELEASE_AUDIO.UPDATE,
                        ]}
                    >
                        <Space.Compact>
                            <CreateButton
                                text={messages('release.create')}
                                onClick={() => {
                                    nProgress.start();
                                    setReleaseAction(
                                        RELEASE_DETAIL_ACTION.READ
                                    );
                                    router.push('/releases/create');
                                }}
                            />

                            <Dropdown
                                menu={{ items: dropdownOptions }}
                                trigger={['click']}
                            >
                                <Button
                                    type="primary"
                                    icon={<EllipsisOutlined />}
                                />
                            </Dropdown>
                        </Space.Compact>
                    </PermissionGate>
                )}
                <AppSupport />
                <AppAvatar />
            </div>
        </AntdHeader>
    );
}

export default Header;
