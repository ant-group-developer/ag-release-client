import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Spin, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { UserData } from '../../types/data';
import UpdateInfo from './update-info';
import UpdatePassword from './update-password';
import UpdateTenant from './update-tenant';

type Props = {} & AppModalProps;

enum TAB_KEY {
    UPDATE_INFO = 'update-info',
    UPDATE_PASSWORD = 'update-password',
    UPDATE_TENANT = 'update-tenant',
}

function UpdateUserModal({ ...props }: Props) {
    const messages = useTranslations();
    const loading = useLoading();

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
            key: TAB_KEY.UPDATE_TENANT,
            label: messages('tenant.label'),
            children: <UpdateTenant dataEdit={dataEdit!} />,
        },
    ];

    return (
        <AppModal
            {...props}
            title={messages('action.update.title', {
                label: dataEdit.email,
            })}
            footer={null}
            width={800}
            loading={loading}
            className="top-10"
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
