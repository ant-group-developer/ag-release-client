'use client';

import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import AcrCloudForm from '@/modules/setting/components/forms/acr-cloud-form';
import BackupDatabaseForm from '@/modules/setting/components/forms/backup-database-form';
import CiTemplateForm from '@/modules/setting/components/forms/ci-template-form';
import GeneralForm from '@/modules/setting/components/forms/general-form';
import GeneratorForm from '@/modules/setting/components/forms/generator-form';
import TelegramForm from '@/modules/setting/components/forms/telegram-form';
import ResendForm from '@/modules/setting/components/forms/resend-form';
import WebsiteForm from '@/modules/setting/components/forms/website-form';
import PartnersForm from '@/modules/setting/components/forms/partners-form';
import SyncStatusForm from '@/modules/setting/components/forms/sync-status-form';
import MultipartUploadForm from '@/modules/setting/components/forms/multipart-upload-form';
import { settingQueryKeys } from '@/modules/setting/constants/query-keys';
import { SETTING_TABS } from '@/modules/setting/enums';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Spin, Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';

type SettingDataFilter = {
    tab?: string;
} & CommonParams;

type Props = {};

export default function SettingPage({}: Props) {
    const { isFetching } = useLoadingStatus({
        queryKeys: [settingQueryKeys.details()],
        mutationKeys: [settingQueryKeys.updates()],
    });
    const { token } = theme.useToken();
    const messages = useTranslations();

    const { dataFilter, onChangeFilter } = useFilter<SettingDataFilter>({
        tab: SETTING_TABS.GENERAL,
        page: 1,
    });

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
        {
            key: SETTING_TABS.GENERATOR,
            label: 'Generator',
            children: <GeneratorForm />,
        },
        {
            key: SETTING_TABS.CI_TEMPLATE,
            label: 'CI Template',
            children: <CiTemplateForm />,
        },
        {
            key: SETTING_TABS.RESEND,
            label: 'Resend',
            children: <ResendForm />,
        },
        {
            key: SETTING_TABS.PARTNERS,
            label: 'Partners',
            children: <PartnersForm />,
        },
        {
            key: SETTING_TABS.SYNC_STATUS,
            label: messages('setting.syncStatus.label'),
            children: <SyncStatusForm />,
        },
        {
            key: SETTING_TABS.MULTIPART_UPLOAD,
            label: messages('setting.multipartUpload.label'),
            children: <MultipartUploadForm />,
        },
    ];


    return (
        <PageContainer title={messages('setting.settings')}>
            <div
                className="rounded-lg"
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                <Spin spinning={isFetching}>
                    <div className="m-auto">
                        <Tabs
                            items={tabItems}
                            tabPosition="left"
                            className="!p-6"
                            activeKey={dataFilter.tab}
                            onChange={(key) => onChangeFilter({ tab: key })}
                        />
                    </div>
                </Spin>
            </div>
        </PageContainer>
    );
}
