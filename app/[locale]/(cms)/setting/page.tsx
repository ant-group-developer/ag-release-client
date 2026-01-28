'use client';

import { useLoadingStatus } from '@/hooks/use-loading-status';
import AcrCloudForm from '@/modules/setting/components/forms/acr-cloud-form';
import BackupDatabaseForm from '@/modules/setting/components/forms/backup-database-form';
import GeneralForm from '@/modules/setting/components/forms/general-form';
import TelegramForm from '@/modules/setting/components/forms/telegram-form';
import WebsiteForm from '@/modules/setting/components/forms/website-form';
import { settingQueryKeys } from '@/modules/setting/constants/query-keys';
import { SETTING_TABS } from '@/modules/setting/enums';
import { PageContainer } from '@ant-design/pro-components';
import { Spin, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function SettingPage({}: Props) {
    const { isFetching } = useLoadingStatus({
        queryKeys: [settingQueryKeys.details()],
        mutationKeys: [settingQueryKeys.updates()],
    });
    // const { token } = theme.useToken();
    const messages = useTranslations();

    const tabItems: TabsProps['items'] = [
        {
            key: SETTING_TABS.GENERAL,
            label: 'General',
            children: <GeneralForm />,
        },
        {
            key: SETTING_TABS.WEBSITE,
            label: 'Website',
            children: <WebsiteForm />,
        },
        {
            key: SETTING_TABS.BACK_UP_DATABASE,
            label: 'Backup Database',
            children: <BackupDatabaseForm />,
        },
        {
            key: SETTING_TABS.TELEGRAM,
            label: 'Telegram',
            children: <TelegramForm />,
        },
        {
            key: SETTING_TABS.ACR_CLOUD,
            label: 'ACRCloud',
            children: <AcrCloudForm />,
        },
    ];

    return (
        <PageContainer title={messages('setting.settings')}>
            <div className="rounded-lg bg-white">
                <Spin spinning={isFetching}>
                    <div className="m-auto">
                        <Tabs
                            items={tabItems}
                            tabPosition="left"
                            className="!p-6"
                        />
                    </div>
                </Spin>
            </div>
        </PageContainer>
    );
}
