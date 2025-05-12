import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import usePermissionStore from '@/hooks/use-permission';
import { TopicData } from '@/modules/topic/types';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { TOPIC_SETTING_TABS } from '../../enums';
import { TopicAssignee } from '../../types';
import QuickTopicSettingsModal from '../modal/quick-topic-settings';
import SettingRadio from './setting-radio';

type Props = {
    disabled?: boolean;
    handleUpdateTopicAssignee: () => void;
    settingTabValue: TOPIC_SETTING_TABS;
    dataTopic: TopicData[];
    topicAssignee: TopicAssignee[];
    handleChangeTab: (value: TOPIC_SETTING_TABS) => void;
};

export default function TopicSettingHeader({
    settingTabValue,
    disabled,
    handleUpdateTopicAssignee,
    handleChangeTab,
    dataTopic,
    topicAssignee,
}: Props) {
    const messages = useTranslations();
    const isLoading = useLoading(UseLoadingType.Mutating);
    const { canUpdate } = usePermissionStore(
        (state) => state.permission.permission
    );
    return (
        <AppHeader>
            <AppHeaderGroup>
                <SettingRadio
                    buttonStyle="solid"
                    value={settingTabValue}
                    onChange={(e) => handleChangeTab(e.target.value)}
                />
                <QuickTopicSettingsModal
                    currentTab={settingTabValue}
                    dataTopic={dataTopic}
                    topicAssignee={topicAssignee}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <Button
                    type="primary"
                    disabled={disabled}
                    onClick={handleUpdateTopicAssignee}
                    loading={isLoading}
                >
                    {messages('common.submit')}
                </Button>
            </AppHeaderGroup>
        </AppHeader>
    );
}
