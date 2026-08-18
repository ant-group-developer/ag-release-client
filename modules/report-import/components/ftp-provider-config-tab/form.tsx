import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
    Alert,
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Spin,
    Switch,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TYPE_MODAL_FTP_PROVIDER_CONFIG } from '../../enums';
import { useCreateFtpProviderConfig } from '../../hooks/use-create';
import { useGetDetailFtpProviderConfig } from '../../hooks/use-get-detail';
import { useTestFtpConnection } from '../../hooks/use-test-ftp-connection';
import { useUpdateFtpProviderConfig } from '../../hooks/use-update';
import { FtpProviderConfigData } from '../../types';
import {
    CreateFtpProviderConfigPayload,
    UpdateFtpProviderConfigPayload,
} from '../../types/payload';

type FtpProviderConfigFormValues = {
    code: string;
    name: string;
    host: string;
    port: number;
    username: string;
    password?: string;
    secure: string;
    basePath: string;
    isActive: boolean;
    description: string;
};

type Props = Omit<AppModalProps, 'children'>;

const SECURE_OPTIONS = [
    { label: 'true (TLS/SSL)', value: 'true' },
    { label: 'false (Plain FTP)', value: 'false' },
    { label: 'explicit (FTPS Explicit)', value: 'explicit' },
    { label: 'implicit (FTPS Implicit)', value: 'implicit' },
];

const DEFAULT_INITIAL_VALUES: FtpProviderConfigFormValues = {
    name: '',
    code: '',
    host: '',
    port: 21,
    username: '',
    password: '',
    secure: 'true',
    basePath: '/',
    isActive: true,
    description: '',
};

export default function FtpProviderConfigForm({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<FtpProviderConfigFormValues>();
    const { active, deActive, isActive: isSubmitting } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<FtpProviderConfigData>(
        (state) => state.dataEdit
    );
    const isUpdateForm = typeModal === TYPE_MODAL_FTP_PROVIDER_CONFIG.UPDATE;
    const configId = isUpdateForm ? dataEdit?.id : undefined;

    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState<string>('');

    const { createFtpProviderConfig, isPending: isCreatePending } =
        useCreateFtpProviderConfig();
    const { updateFtpProviderConfig, isPending: isUpdatePending } =
        useUpdateFtpProviderConfig();
    const { ftpProviderConfigData, isFetching } =
        useGetDetailFtpProviderConfig(configId);
    const { testFtpConnection, isTesting } = useTestFtpConnection();

    const buildPayload = (
        values: FtpProviderConfigFormValues
    ): CreateFtpProviderConfigPayload => {
        const payload: CreateFtpProviderConfigPayload = {
            code: values.code?.trim(),
            name: values.name?.trim(),
            host: values.host?.trim(),
            port: Number(values.port) || 21,
            username: values.username?.trim(),
            secure: values.secure,
            basePath: values.basePath?.trim() || '/',
            isActive: Boolean(values.isActive),
            description: values.description?.trim() ?? '',
        };
        if (values.password) {
            payload.password = values.password;
        }
        return payload;
    };

    const handleCreate = (values: FtpProviderConfigFormValues) => {
        const variables: CreateVariables<CreateFtpProviderConfigPayload> = {
            payload: buildPayload(values),
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        createFtpProviderConfig(variables);
    };

    const handleUpdate = (values: FtpProviderConfigFormValues) => {
        const variables: UpdateVariables<
            FtpProviderConfigData['id'],
            UpdateFtpProviderConfigPayload
        > = {
            id: dataEdit?.id,
            payload: buildPayload(values),
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        updateFtpProviderConfig(variables);
    };

    const onFinish = (values: FtpProviderConfigFormValues) => {
        if (!isUpdateForm && testStatus !== 'success') {
            return;
        }
        active();
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    const handleTestConnection = async () => {
        try {
            await form.validateFields([
                'host',
                'port',
                'username',
                ...(isUpdateForm ? [] : ['password']),
                'secure',
            ]);
        } catch {
            return;
        }

        const host = form.getFieldValue('host');
        const port = form.getFieldValue('port');
        const username = form.getFieldValue('username');
        const password = form.getFieldValue('password');
        const secure = form.getFieldValue('secure');

        if (!host || !port || !username) {
            return;
        }

        try {
            const res = await testFtpConnection({
                host: host?.trim(),
                port: Number(port) || 21,
                username: username?.trim(),
                password: password || '',
                secure: secure ?? 'true',
            });

            if (res?.data?.data?.ok || res?.data?.statusCode === 200) {
                setTestStatus('success');
                setTestMessage(
                    messages('reportConfigs.ftpProviderConfig.testConnectionSuccess')
                );
            } else {
                setTestStatus('error');
                setTestMessage(
                    messages('reportConfigs.ftpProviderConfig.testConnectionFailed')
                );
            }
        } catch {
            setTestStatus('error');
            setTestMessage(
                messages('reportConfigs.ftpProviderConfig.testConnectionFailed')
            );
        }
    };

    const handleValuesChange = (changedValues: Partial<FtpProviderConfigFormValues>) => {
        const connectionFields = ['host', 'port', 'username', 'password', 'secure'];
        const hasConnectionFieldChanged = Object.keys(changedValues).some((key) =>
            connectionFields.includes(key)
        );

        if (hasConnectionFieldChanged && testStatus !== 'idle') {
            setTestStatus('idle');
            setTestMessage('');
        }
    };

    useEffect(() => {
        if (isUpdateForm && ftpProviderConfigData) {
            form.setFieldsValue({
                code: ftpProviderConfigData.code ?? '',
                name: ftpProviderConfigData.name ?? '',
                host: ftpProviderConfigData.host ?? '',
                port: ftpProviderConfigData.port ?? 21,
                username: ftpProviderConfigData.username ?? '',
                secure: String(ftpProviderConfigData.secure ?? 'true'),
                basePath: ftpProviderConfigData.basePath ?? '/',
                isActive: Boolean(ftpProviderConfigData.isActive),
                description: ftpProviderConfigData.description ?? '',
            });
        }
    }, [isUpdateForm, form, ftpProviderConfigData]);

    const modalTitle = isUpdateForm
        ? messages('reportConfigs.ftpProviderConfig.action.update')
        : messages('reportConfigs.ftpProviderConfig.action.create');

    const canSubmit = isUpdateForm || testStatus === 'success';

    return (
        <AppModal
            {...props}
            open
            centered
            title={modalTitle}
            width={580}
            onCancel={closeModal}
            onOk={form.submit}
            okButtonProps={{
                disabled: !canSubmit || isSubmitting,
            }}
            loading={isCreatePending || isUpdatePending}
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    paddingRight: 8,
                },
            }}
        >
            <Spin spinning={isFetching}>
                <AppForm
                    form={form}
                    initialValues={DEFAULT_INITIAL_VALUES}
                    showSubmit={false}
                    onFinish={onFinish}
                    onValuesChange={handleValuesChange}
                    layout="vertical"
                    disabled={isSubmitting}
                >
                    <AppFormItem
                        name="name"
                        label={messages('reportConfigs.ftpProviderConfig.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear placeholder="Merlin" />
                    </AppFormItem>

                    <AppFormItem
                        name="code"
                        label={messages('reportConfigs.ftpProviderConfig.code')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear placeholder="merlin" />
                    </AppFormItem>

                    <AppFormItem
                        name="host"
                        label={messages('reportConfigs.ftpProviderConfig.host')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear placeholder="ftp.merlin.example.com" />
                    </AppFormItem>

                    <AppFormItem
                        name="port"
                        label={messages('reportConfigs.ftpProviderConfig.port')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={65535}
                            style={{ width: '100%' }}
                            placeholder="21"
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="username"
                        label={messages('reportConfigs.ftpProviderConfig.username')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear placeholder="username" />
                    </AppFormItem>

                    <AppFormItem
                        name="password"
                        label={messages('reportConfigs.ftpProviderConfig.password')}
                        required={!isUpdateForm}
                        rules={
                            isUpdateForm
                                ? []
                                : [
                                      {
                                          required: true,
                                          message: messages('validation.input'),
                                      },
                                  ]
                        }
                    >
                        <Input.Password
                            placeholder={
                                isUpdateForm
                                    ? messages('reportConfigs.ftpProviderConfig.passwordPlaceholderUpdate')
                                    : messages('reportConfigs.ftpProviderConfig.passwordPlaceholder')
                            }
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="secure"
                        label={messages('reportConfigs.ftpProviderConfig.secure')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select options={SECURE_OPTIONS} />
                    </AppFormItem>

                    <AppFormItem
                        name="basePath"
                        label={messages('reportConfigs.ftpProviderConfig.basePath')}
                    >
                        <Input allowClear placeholder="/root" />
                    </AppFormItem>

                    {/* Test connection action section */}
                    <div
                        style={{
                            background: '#f6f8fa',
                            padding: '12px 16px',
                            borderRadius: 8,
                            marginBottom: 16,
                            border: '1px solid #e1e4e8',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            <div>
                                <span style={{ fontWeight: 600 }}>
                                    {messages('reportConfigs.ftpProviderConfig.testConnectionLabel')}
                                </span>
                                <div style={{ fontSize: 12, color: '#65696e' }}>
                                    {messages('reportConfigs.ftpProviderConfig.testConnectionHint')}
                                </div>
                            </div>
                            <Button
                                icon={<ApiOutlined />}
                                onClick={handleTestConnection}
                                loading={isTesting}
                            >
                                {messages('reportConfigs.ftpProviderConfig.testConnection')}
                            </Button>
                        </div>

                        {testStatus === 'success' && (
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                message={testMessage || messages('reportConfigs.ftpProviderConfig.testConnectionSuccess')}
                                style={{ marginTop: 10 }}
                            />
                        )}

                        {testStatus === 'error' && (
                            <Alert
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined />}
                                message={testMessage || messages('reportConfigs.ftpProviderConfig.testConnectionFailed')}
                                style={{ marginTop: 10 }}
                            />
                        )}

                        {!isUpdateForm && testStatus !== 'success' && (
                            <div style={{ marginTop: 8, fontSize: 12, color: '#e67e22' }}>
                                * {messages('reportConfigs.ftpProviderConfig.testConnectionRequired')}
                            </div>
                        )}
                    </div>

                    <AppFormItem
                        name="description"
                        label={messages('reportConfigs.ftpProviderConfig.description')}
                    >
                        <Input.TextArea allowClear rows={3} placeholder="Description..." />
                    </AppFormItem>

                    <AppFormItem
                        name="isActive"
                        label={messages('reportConfigs.ftpProviderConfig.isActive')}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </AppFormItem>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
