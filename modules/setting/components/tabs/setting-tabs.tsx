import { Tabs, TabsProps } from 'antd';
import { SettingWebSiteForm } from '../form/setting-website-form';

type Props = {};

export default function SettingTabs({}: Props) {
    const onChange = (key: string) => {};

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <b>Website</b>,
            children: <SettingWebSiteForm />,
        },
        // {
        //     key: '2',
        //     label: <b>Log</b>,
        //     children: 'Content of Tab Pane 2',
        // },
    ];

    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
