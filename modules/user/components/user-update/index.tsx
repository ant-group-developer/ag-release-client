import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Spin, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { UserData } from '../../types/data';
import UpdateInfo from './update-info';
import UpdatePassword from './update-password';
import UpdatePermission from './update-permission';
import UpdateTenant from './update-tenant';
import UserChannels from './user-channels';
import ViewPermission from './view-permission';

type Props = {} & AppModalProps;

enum TAB_KEY {
    UPDATE_INFO = 'update-info',
    UPDATE_PASSWORD = 'update-password',
    UPDATE_TENANT = 'update-tenant',
    UPDATE_PERMISSION = 'update-permission',
    VIEW_PERMISSION = 'view-permission',
    USER_CHANNELS = 'user-channels',
}

function UpdateUserModal({ ...props }: Props) {
    const messages = useTranslations();
    const loading = useLoading();
    const { isSystemTenant } = useAuth();

    const dataEdit = useModalStore<UserData>((state) => state.dataEdit);
    const [activeTab, setActiveTab] = useState<TAB_KEY>(TAB_KEY.UPDATE_INFO);

    const items: TabsProps['items'] = [
        {
            key: TAB_KEY.UPDATE_INFO,
            label: messages('user.personalInfo'),
            children: <UpdateInfo dataEdit={dataEdit!} />,
        },
        {
            key: TAB_KEY.UPDATE_PASSWORD,
            label: messages('user.changePassword'),
            children: <UpdatePassword dataEdit={dataEdit!} />,
        },
        {
            key: TAB_KEY.UPDATE_PERMISSION,
            label: messages('user.grantPermission.label'),
            children: <UpdatePermission dataEdit={dataEdit!} />,
        },
        {
            key: TAB_KEY.VIEW_PERMISSION,
            label: messages('permission.label'),
            children: <ViewPermission dataEdit={dataEdit!} />,
        },
        {
            key: TAB_KEY.USER_CHANNELS,
            label: messages('channel.label'),
            children: <UserChannels dataEdit={dataEdit!} />,
        },
    ];

    if (isSystemTenant) {
        items.push({
            key: TAB_KEY.UPDATE_TENANT,
            label: messages('tenant.label'),
            children: <UpdateTenant dataEdit={dataEdit!} />,
        });
    }

    return (
        <AppModal
            {...props}
            title={messages('action.update.title', {
                label: dataEdit.email,
            })}
            footer={null}
            width={'50vw'}
            loading={loading}
            className="!top-5"
        >
            <Spin spinning={loading}>
                <Tabs
                    items={items}
                    activeKey={activeTab}
                    onChange={(value) => setActiveTab(value as TAB_KEY)}
                />
            </Spin>
        </AppModal>
    );
}

export default UpdateUserModal;
