import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import {
    useTestConnection,
    useTestConnectionById,
} from '@/modules/sftp-config/hooks/use-test-connection';
import {
    TestSftpConnectionByIdPayload,
    TestSftpConnectionPayload,
} from '@/modules/sftp-config/types/payload';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Spin, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_AGGREGATOR } from '../../enums';
import { useCreateAggregator } from '../../hooks/use-create';
import { useGetDetailAggregator } from '../../hooks/use-get-detail';
import { useUpdateAggregator } from '../../hooks/use-update';
import { AggregatorData } from '../../types';
import {
    CreateAggregatorPayload,
    UpdateAggregatorPayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AggregatorForm({ ...props }: Props) {
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const {
        active: connectionActive,
        isActive: isConnectionActive,
        deActive: deActiveConnection,
    } = useActive();

    const typeModal = useModalStore((s) => s.typeModal);
    const dataEdit = useModalStore<AggregatorData>((s) => s.dataEdit);
    const messages = useTranslations();
    const isUpdateForm = typeModal === TYPE_MODAL_AGGREGATOR.UPDATE;

    // apis
    const { createAggregator } = useCreateAggregator();
    const { updateAggregator } = useUpdateAggregator();
    const { aggregatorData, isFetching: DetailLoading } =
        useGetDetailAggregator(dataEdit?.id);
    const { testConnection } = useTestConnection();
    const { testConnectionById } = useTestConnectionById();

    const modalTitle =
        typeModal === TYPE_MODAL_AGGREGATOR.CREATE
            ? messages('aggregator.action.create')
            : messages('aggregator.action.update');

    // const
    const commonValidate = [
        {
            required: true,
            message: messages('validation.input'),
        },
        {
            max: MAX_NAME_LENGTH,
            message: messages('validation.max', {
                number: MAX_NAME_LENGTH,
            }),
        },
    ];

    const handleCreate = (values: any) => {
        active();
        const variables: CreateVariables<CreateAggregatorPayload> = {
            payload: values,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createAggregator(variables);
    };

    const handleUpdate = (values: any) => {
        active();
        const { sftpConfig, ...res } = values;
        const payload = {
            ...res,
            sftpConfig: {
                ...sftpConfig,
                id: aggregatorData?.sftpConfig?.id,
                metadata: {
                    ...sftpConfig?.metadata,
                    password: sftpConfig?.metadata?.password ?? undefined,
                    privateKey: sftpConfig?.metadata?.privateKey ?? undefined,
                },
            },
        };

        if (!payload.sftpConfig.metadata?.password) {
            delete payload.sftpConfig.metadata.password;
        }
        if (!payload.sftpConfig.metadata?.privateKey) {
            delete payload.sftpConfig.metadata.privateKey;
        }

        const variables: UpdateVariables<
            AggregatorData['id'],
            UpdateAggregatorPayload
        > = {
            id: dataEdit?.id,
            payload: payload,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateAggregator(variables);
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
            if (isUpdateForm) {
                if (!aggregatorData?.sftpConfig?.id) return;
                const { sftpConfig } = form.getFieldsValue();

                const payload = {
                    id: aggregatorData?.sftpConfig?.id,
                    ...sftpConfig.metadata,
                };

                if (!payload?.password) {
                    delete payload.password;
                }

                if (!payload?.privateKey) {
                    delete payload.privateKey;
                }

                const variables: CreateVariables<TestSftpConnectionByIdPayload> =
                    {
                        payload,
                        onSuccess(e) {
                            deActiveConnection();
                            handleShowNotiTestConnection(e.status);
                        },
                        onError(e) {
                            console.log('🚀 ~ handleTestConnection ~ e:', e);
                        },
                    };
                testConnectionById(variables);
            } else {
                const { sftpConfig } = form.getFieldsValue();
                const { host, port, username, password } = sftpConfig.metadata;

                if (!host || !port || !username || !password) {
                    showNotification(
                        'error',
                        messages('sftp.requiredSftpInfo')
                    );
                    deActiveConnection();
                    return;
                }
                const variables: CreateVariables<TestSftpConnectionPayload> = {
                    payload: {
                        ...sftpConfig.metadata,
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
                testConnection(variables);
            }
        } catch (error) {
            console.log('Test connection: ', error);
            deActiveConnection();
        }
    };

    const onFinish = (values: any) => {
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    useEffect(() => {
        if (isUpdateForm) {
            form.setFieldsValue({ ...aggregatorData });
        }
    }, [isUpdateForm, aggregatorData, form]);

    return (
        <AppModal
            {...props}
            title={modalTitle}
            onOk={form.submit}
            loading={isActive}
            width={'40vw'}
            className="!top-8"
            styles={{
                body: {
                    overflowY: 'auto',
                    paddingRight: '4px',
                },
            }}
            footer={(originNode) => (
                <>
                    <Button
                        onClick={(e) => {
                            handleTestConnection();
                        }}
                        icon={<PoweroffOutlined />}
                        loading={isConnectionActive}
                        type="default"
                        htmlType="button"
                    >
                        {messages('connection.test')}
                    </Button>
                    {originNode}
                </>
            )}
        >
            <Spin spinning={DetailLoading}>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                    initialValues={{
                        isActive: false,
                        isDefault: false,
                        sftpConfig: {
                            metadata: {
                                password: undefined,
                            },
                        },
                    }}
                >
                    <div className="">
                        <AppFormItem
                            name="name"
                            label={messages('common.name')}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                {
                                    max: 200,
                                    message: messages('validation.stringMax', {
                                        max: 200,
                                        field: messages('common.name'),
                                    }),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>
                        <AppFormItem
                            name="code"
                            label={messages('common.code')}
                            required
                            rules={commonValidate}
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            name="isDefault"
                            label={messages('aggregator.systemDefault')}
                            valuePropName="checked"
                        >
                            <Switch />
                        </AppFormItem>
                        <AppFormItem
                            name="isActive"
                            label={messages('common.status')}
                            valuePropName="checked"
                        >
                            <Switch />
                        </AppFormItem>

                        <AppFormItem
                            name="createsDoneFolder"
                            label={messages('aggregator.createsDoneFolder')}
                            valuePropName="checked"
                        >
                            <Switch />
                        </AppFormItem>

                        <AppFormItem
                            name="ddexId"
                            label={messages('dsp.ddexPartyId')}
                            rules={[
                                {
                                    max: MAX_NAME_LENGTH,
                                    message: messages('validation.stringMax', {
                                        max: MAX_NAME_LENGTH,
                                        field: 'DDexId',
                                    }),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            name="ddexName"
                            label={messages('dsp.fullNameOfDDexParty')}
                            rules={[
                                {
                                    max: MAX_NAME_LENGTH,
                                    message: messages('validation.stringMax', {
                                        max: MAX_NAME_LENGTH,
                                        field: messages('aggregator.ddexName'),
                                    }),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <Divider />

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'host']}
                            label="Host"
                            required
                            rules={commonValidate}
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'port']}
                            label="Port"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <InputNumber className="!w-full" />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'path']}
                            label="Path"
                        >
                            <Input />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'ernVersion']}
                            label={messages('aggregator.ernVersion')}
                        >
                            <Input />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'username']}
                            label={messages('common.username')}
                            required
                            rules={commonValidate}
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'password']}
                            label={messages('common.password')}
                        >
                            <Input.Password autoComplete="new-password" />
                        </AppFormItem>

                        <AppFormItem
                            name={['sftpConfig', 'metadata', 'privateKey']}
                            label={messages('common.privateKey')}
                        >
                            <TextArea />
                        </AppFormItem>
                    </div>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
