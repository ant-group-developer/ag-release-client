import { Radio, RadioGroupProps } from 'antd';
import { useTranslations } from 'next-intl';
import { TOPIC_SETTING_TABS } from '../../enums';

type Props = RadioGroupProps & {};

export default function SettingRadio({ ...props }: Props) {
    const messages = useTranslations();
    return (
        <Radio.Group {...props}>
            <Radio.Button value={TOPIC_SETTING_TABS.ASSIGNEE}>
                {messages('setting.assignee')}
            </Radio.Button>
            <Radio.Button value={TOPIC_SETTING_TABS.APPROVER}>
                {messages('setting.reviewer')}
            </Radio.Button>
            <Radio.Button value={TOPIC_SETTING_TABS.RATE}>
                {messages('setting.rate')}
            </Radio.Button>
        </Radio.Group>
    );
}
