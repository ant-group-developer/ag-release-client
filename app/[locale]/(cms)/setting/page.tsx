'use client';

import AppContainer from '@/components/cms/app-container';
import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { showNotification } from '@/helpers/messages-helper';
import {
    useAppConfig,
    useUpdateAppConfig,
} from '@/modules/app-config/hooks/use-app-config';
import Editor, { OnMount } from '@monaco-editor/react';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type Props = {};

export default function SettingPage({}: Props) {
    const messages = useTranslations();
    const editorRef = useRef<any>(null);
    const [count, setCount] = useState(0);
    const [form] = Form.useForm();

    const updateMutation = useUpdateAppConfig();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        setCount((prev) => prev + 1);
    };

    const { data } = useAppConfig();

    const onFinish = ({ data }: any) => {
        try {
            updateMutation.mutate({ data: JSON.parse(data) });
        } catch (error: any) {
            showNotification('error', error.message);
        }
    };

    useEffect(() => {
        form.setFieldValue('data', JSON.stringify(data?.data || {}));
        setCount((prev) => prev + 1);
    }, [form, editorRef, data]);

    useEffect(() => {
        editorRef.current?.getAction('editor.action.formatDocument')?.run();
    }, [count]);

    return (
        <AppContainer appTitle={messages('common.setting')}>
            <AppForm
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
            </AppForm>
        </AppContainer>
    );
}
