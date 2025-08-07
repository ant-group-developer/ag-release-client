import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Spin, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TenantData } from '../../types/data';
import UpdateInfo from './update-info';
import UpdateUser from './update-user';

type Props = {} & AppModalProps;

enum TAB_KEY {
    UPDATE_INFO = 'update-info',
    UPDATE_USER = 'update-tenant',
    UPDATE_ROLE = 'update-role',
}

function UpdateTenantModal({ ...props }: Props) {
    const messages = useTranslations();
    const loading = useLoading();

    const dataEdit = useModalStore<TenantData>((state) => state.dataEdit);
    const [activeTab, setActiveTab] = useState<TAB_KEY>(TAB_KEY.UPDATE_INFO);

    const items: TabsProps['items'] = [
        {
            key: TAB_KEY.UPDATE_INFO,
            label: messages('tenant.label'),
            children: <UpdateInfo dataEdit={dataEdit!} />,
        },
        {
            key: TAB_KEY.UPDATE_USER,
            label: messages('user.label'),
            children: <UpdateUser dataEdit={dataEdit!} />,
        },
    ];

    return (
        <AppModal
            {...props}
            title={messages('action.update.title', {
                label: dataEdit.email,
            })}
            footer={null}
            width={650}
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

export default UpdateTenantModal;
