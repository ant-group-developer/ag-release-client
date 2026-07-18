import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import { SIZE_ICON, SIZE_ICON_BIG } from '@/constants/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import ErnVersionSelect from '@/modules/aggregator/components/select/ern-version-select';
import {
    useTestConnection,
    useTestConnectionById,
} from '@/modules/sftp-config/hooks/use-test-connection';
import {
    TestSftpConnectionByIdPayload,
    TestSftpConnectionPayload,
} from '@/modules/sftp-config/types/payload';
import { CreateVariables } from '@/types/api';
import { CheckCard } from '@ant-design/pro-components';
import { Alert, Button, Divider, Form, Input, InputNumber } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { Play, Settings, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { DSP_DEAL_TENANT } from '../../enums';
import { useUpdateTenantDsp } from '../../hooks/use-update-tenant-dsp';
import { TenantDspData } from '../../types';
import { UpdateTenantDspPayload } from '../../types/payload';

export default function DspTenantModal() {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const watchDeal = useWatch('mode', form);
    const { isActive, deActive, active } = useActive();
    const {
        active: connectionActive,
        isActive: isConnectionActive,
        deActive: deActiveConnection,
    } = useActive();

    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TenantDspData>((state) => state.dataEdit);
    const dspId = dataEdit?.dspId;

    const { updateTenantDsp, isUpdating } = useUpdateTenantDsp();
    const { testConnection } = useTestConnection();
    const { testConnectionById } = useTestConnectionById();

    const onFinish = (values: any) => {
        active();
        const sftpConfig = values.sftpConfig;
        try {
            const payload: UpdateTenantDspPayload = {
                mode: values.mode,
            };

            if (sftpConfig) {
                const metadata = { ...sftpConfig?.metadata };

                if (!metadata?.password) {
                    delete metadata.password;
                }
                if (!metadata?.privateKey) {
                    delete metadata.privateKey;
                }

                payload.sftpConfig = {
                    ...sftpConfig,
                    metadata,
                };
            }

            if (dspId) {
                updateTenantDsp({
                    id: dspId,
                    payload,
                    onSuccess: () => {
                        deActive();
                        closeModal();
                    },
                    onError: () => {
                        deActive();
                    },
                } as any);
            }
        } catch (error) {
            console.log('Update Tenant DSP error:', error);
            deActive();
        }
    };

    const handleShowNotiTestConnection = (status: boolean) => {
        if (status) {
            showNotification('success', messages('connection.success'));
        } else {
            showNotification('error', messages('connection.failure'));
        }
    };

    const handleTestConnection = () => {
        connectionActive();
        try {
            const { sftpConfig } = form.getFieldsValue();
            const { host, port, username, password, privateKey } =
                sftpConfig?.metadata || {};

            if (password || privateKey) {
                form.setFields([
                    {
                        name: ['sftpConfig', 'metadata', 'password'],
                        errors: [],
                    },
                    {
                        name: ['sftpConfig', 'metadata', 'privateKey'],
                        errors: [],
                    },
                ]);
            }

            if (!password && !privateKey && !dataEdit?.sftpConfig?.id) {
                form.setFields([
                    {
                        name: ['sftpConfig', 'metadata', 'password'],
                        errors: [messages('sftp.requiredPasswordOrPrivateKey')],
                    },
                    {
                        name: ['sftpConfig', 'metadata', 'privateKey'],
                        errors: [messages('sftp.requiredPasswordOrPrivateKey')],
                    },
                ]);
                deActiveConnection();
                return;
            }

            const payload = {
                ...sftpConfig.metadata,
            };

            if (!payload?.password) {
                delete payload.password;
            }
            if (!payload?.privateKey) {
                delete payload.privateKey;
            }

            const variables: CreateVariables<TestSftpConnectionPayload> = {
                payload,
                onSuccess(e) {
                    deActiveConnection();
                    handleShowNotiTestConnection(e.status);
                },
                onError(e) {
                    console.log('Test connection sftp', e);
                    deActiveConnection();
                },
            };
            if (dataEdit?.sftpConfig?.id && !password && !privateKey) {
                const variables: CreateVariables<TestSftpConnectionByIdPayload> =
                    {
                        payload: {
                            id: dataEdit.sftpConfig.id,
                            ...payload,
                        },
                        onSuccess(e) {
                            deActiveConnection();
                            handleShowNotiTestConnection(e.status);
                        },
                        onError(e) {
                            console.log('Test connection sftp', e);
                            deActiveConnection();
                        },
                    };
                return testConnectionById(variables);
            } else {
                testConnection(variables);
            }
        } catch (error) {
            console.log('Test connection: ', error);
            deActiveConnection();
        }
    };

    useEffect(() => {
        if (dataEdit) {
            form?.setFieldsValue({
                mode: dataEdit.mode,
                aggregatorId: dataEdit.aggregatorId,
                sftpConfig: dataEdit.sftpConfig,
            });
        }
    }, [dataEdit, form]);

    return (
        <AppModal
            width={'40vw'}
            title={`${messages('common.update')} DSP Deal`}
            open
            onCancel={closeModal}
            footer={false}
        >
            <>
                <AppForm
                    form={form}
                    disabled={isActive || isUpdating}
                    onFinish={onFinish}
                    showSubmit={false}
                >
                    <AppFormItem
                        layout="vertical"
                        wrapperCol={{ span: 24 }}
                        name={'mode'}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <CheckCard.Group
                            disabled={isActive || isUpdating}
                            style={{ width: '100%' }}
                            size="small"
                            className="!grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2"
                        >
                            <CheckCard
                                className="!m-0 !w-full"
                                avatar={<UserCog size={SIZE_ICON_BIG} />}
                                title={
                                    <span>
                                        {messages(
                                            'integration.deal.direct.label'
                                        )}
                                    </span>
                                }
                                value={DSP_DEAL_TENANT.DIRECT}
                            />
                            <CheckCard
                                className="!m-0 !w-full"
                                avatar={<Settings size={SIZE_ICON_BIG} />}
                                title={
                                    <span>
                                        {messages('aggregator.systemDefault')}
                                    </span>
                                }
                                value={DSP_DEAL_TENANT.SYSTEM_DEFAULT}
                            />
                        </CheckCard.Group>
                    </AppFormItem>

                    <Divider />

                    {watchDeal === DSP_DEAL_TENANT.SYSTEM_DEFAULT && (
                        <Alert
                            message={messages('aggregator.systemDefaultNote')}
                            type="info"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    {watchDeal === DSP_DEAL_TENANT.DIRECT && (
                        <>
                            <AppFormItem
                                label="Host/Server address"
                                name={['sftpConfig', 'metadata', 'host']}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input placeholder="For ex: example.service.com or 216.81.210.36" />
                            </AppFormItem>
                            <AppFormItem
                                label="Port"
                                name={['sftpConfig', 'metadata', 'port']}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Enter 21 unless you received other instructions"
                                    style={{ width: '100%' }}
                                />
                            </AppFormItem>
                            <AppFormItem
                                label="Path"
                                name={['sftpConfig', 'metadata', 'path']}
                            >
                                <Input />
                            </AppFormItem>
                            <AppFormItem
                                name={['sftpConfig', 'ernVersion']}
                                label={messages('aggregator.ernVersion')}
                            >
                                <ErnVersionSelect />
                            </AppFormItem>
                            <AppFormItem
                                label="Username"
                                name={['sftpConfig', 'metadata', 'username']}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input
                                    autoComplete="off"
                                    placeholder="Enter name"
                                />
                            </AppFormItem>
                            <AppFormItem
                                label="Password"
                                name={['sftpConfig', 'metadata', 'password']}
                            >
                                <Input.Password
                                    autoComplete="off"
                                    placeholder="Enter password"
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('common.privateKey')}
                                name={['sftpConfig', 'metadata', 'privateKey']}
                            >
                                <TextArea />
                            </AppFormItem>
                        </>
                    )}
                </AppForm>

                <div className="mt-4 flex justify-end gap-2">
                    {watchDeal === DSP_DEAL_TENANT.DIRECT && (
                        <Button
                            onClick={handleTestConnection}
                            icon={
                                <div>
                                    <Play size={SIZE_ICON} />
                                </div>
                            }
                            loading={isConnectionActive}
                            type="default"
                            htmlType="button"
                        >
                            {messages('connection.test')}
                        </Button>
                    )}
                    <Button
                        loading={isActive || isUpdating}
                        type="primary"
                        onClick={() => form?.submit()}
                    >
                        {messages('common.submit')}
                    </Button>
                </div>
            </>
        </AppModal>
    );
}
