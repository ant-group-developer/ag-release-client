'use client';

import AppContainer from '@/components/cms/app-container';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import AcrCloudForm from '@/modules/setting/components/forms/acr-cloud-form';
import BackupDatabaseForm from '@/modules/setting/components/forms/backup-database-form';
import TelegramForm from '@/modules/setting/components/forms/telegram-form';
import WebsiteForm from '@/modules/setting/components/forms/website-form';
import { settingQueryKeys } from '@/modules/setting/constants/query-keys';
import { SETTING_TABS } from '@/modules/setting/enums';
import { Spin, Tabs, TabsProps } from 'antd';

type Props = {};

export default function SettingPage({}: Props) {
    const { isFetching } = useLoadingStatus({
        queryKeys: [settingQueryKeys.details()],
        mutationKeys: [settingQueryKeys.updates()],
    });
    // const editorRef = useRef<any>(null);
    // const [count, setCount] = useState(0);
    // const [form] = Form.useForm();

    // const updateMutation = useUpdateAppConfig();

    // const handleEditorDidMount: OnMount = (editor, monaco) => {
    //     editorRef.current = editor;
    //     setCount((prev) => prev + 1);
    // };

    // const { data } = useAppConfig();

    // const onFinish = ({ data }: any) => {
    //     try {
    //         updateMutation.mutate({ data: JSON.parse(data) });
    //     } catch (error: any) {
    //         showNotification('error', error.message);
    //     }
    // };

    // useEffect(() => {
    //     form.setFieldValue('data', JSON.stringify(data?.data || {}));
    //     setCount((prev) => prev + 1);
    // }, [form, editorRef, data]);

    // useEffect(() => {
    //     editorRef.current?.getAction('editor.action.formatDocument')?.run();
    // }, [count]);

    const tabItems: TabsProps['items'] = [
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
            label: 'ACR Cloud',
            children: <AcrCloudForm />,
        },
    ];

    return (
        <AppContainer hideAppTitle>
            {/* <AppForm
                layout="vertical"
                onFinish={onFinish}
                form={form}
                submitProps={{
                    loading: updateMutation.isPending,
                }}
            >
                <AppFormItem
                    name={'data'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Editor
                        height="700px"
                        language="json"
                        theme="vs-dark"
                        onMount={handleEditorDidMount}
                        options={{
                            cursorStyle: 'line',
                            formatOnPaste: true,
                            formatOnType: true,
                        }}
                    />
                </AppFormItem>
            </AppForm> */}
            <Spin spinning={isFetching}>
                <div className="m-auto max-w-4xl">
                    <Tabs items={tabItems} />
                </div>
            </Spin>
        </AppContainer>
    );
}
