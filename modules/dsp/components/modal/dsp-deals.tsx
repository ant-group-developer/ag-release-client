import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { SIZE_ICON, SIZE_ICON_BIG } from '@/constants/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import ErnVersionSelect from '@/modules/aggregator/components/select/ern-version-select';
import { useGetListAggregator } from '@/modules/aggregator/hooks/use-get-list';
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
import {
    Button,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Select,
    SelectProps,
    Spin,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { LayoutList, Play, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { DSP_DEAL } from '../../enums';
import { useGetDspRoutingConfig } from '../../hooks/use-get-dsp-routing-config';
import { useUpdateDspRoutingConfig } from '../../hooks/use-update-dsp-routing-config';
import { UpdateDspRoutingConfig } from '../../types/payload';

type Props = {
    dspId: string;
};

export default function DspDeals({ dspId }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const watchDeal = useWatch('mode', form);
    const { isActive, deActive, active } = useActive();
    const {
        active: connectionActive,
        isActive: isConnectionActive,
        deActive: deActiveConnection,
    } = useActive();

    const { dspRoutingConfig, isFetching: dspRoutingFetching } =
        useGetDspRoutingConfig(dspId);
    const { aggregatorsData, isFetching } = useGetListAggregator({});
    const { updateDspRoutingConfig } = useUpdateDspRoutingConfig();
    const { testConnection } = useTestConnection();
    const { testConnectionById } = useTestConnectionById();

    const aggregatorOptions: SelectProps['options'] =
        aggregatorsData?.items?.map((item) => ({
            label: item?.name,
            value: item?.id,
        }));

    const onFinish = (values: any) => {
        active();
        const sftpConfig = values.sftpConfig;
        try {
            const payload = {
                ...values,
                dspId,
            };

            // Chỉ thêm sftpConfig nếu nó tồn tại
            if (sftpConfig) {
                const metadata = { ...sftpConfig?.metadata };

                // Xóa key nếu không có giá trị
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
            const variables: CreateVariables<UpdateDspRoutingConfig> = {
                payload,
                onSuccess(e) {
                    deActive();
                },
                onError(e) {
                    deActive();
                },
            };

            updateDspRoutingConfig(variables);
        } catch (error) {
            console.log('Update DSP error:', error);
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
                sftpConfig.metadata;

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

            if (!password && !privateKey && !dspRoutingConfig?.sftpConfig?.id) {
                form.setFields([
                    {
                        name: ['sftpConfig', 'metadata', 'password'],
                        errors: [messages('sftp.requiredPasswordOrPrivateKey')],
                    },
                ]);

                form.setFields([
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
            if (dspRoutingConfig?.sftpConfig?.id && !password && !privateKey) {
                const variables: CreateVariables<TestSftpConnectionByIdPayload> =
                    {
                        payload: {
                            id: dspRoutingConfig?.sftpConfig?.id,
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
        form?.setFieldsValue(dspRoutingConfig);
    }, [dspRoutingConfig]);

    return (
        <Spin spinning={isFetching || dspRoutingFetching}>
            <AppForm
                form={form}
                disabled={isActive}
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
                        disabled={isActive}
                        style={{ width: '100%' }}
                        size="small"
                        className="!grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2"
                    >
                        {/* <CheckCard
                            className="!m-0 !w-full"
                            avatar={<Settings size={SIZE_ICON_BIG} />}
                            title={
                                <span>
                                    {messages('aggregator.systemDefault')}
                                </span>
                            }
                            value={DSP_DEAL.SYSTEM_DEFAULT}
                        /> */}
                        <CheckCard
                            className="!m-0 !w-full"
                            avatar={<UserCog size={SIZE_ICON_BIG} />}
                            title={
                                <span>
                                    {messages('integration.deal.direct.label')}
                                </span>
                            }
                            value={DSP_DEAL.DIRECT}
                        />
                        <CheckCard
                            className="!m-0 !w-full"
                            avatar={<LayoutList size={SIZE_ICON_BIG} />}
                            title={
                                <span>
                                    {messages('aggregator.aggregators')}
                                </span>
                            }
                            value={DSP_DEAL.AGGREGATOR}
                        />
                    </CheckCard.Group>
                </AppFormItem>

                <Divider />

                {watchDeal == DSP_DEAL.AGGREGATOR && (
                    <div>
                        <AppFormItem
                            name="aggregatorId"
                            layout="vertical"
                            wrapperCol={{ span: 24 }}
                        >
                            {/* <Radio.Group className="flex flex-col gap-2">
                                {aggregatorsData?.items?.map((item) => {
                                    return (
                                        <Radio
                                            key={item?.id}
                                            className="!h-full !w-full"
                                            value={item?.id}
                                        >
                                           
                                            <span className="ml-1">
                                                {item?.name}
                                            </span>
                                        </Radio>
                                    );
                                })}
                            </Radio.Group> */}
                            <Select options={aggregatorOptions} />
                        </AppFormItem>
                        {aggregatorsData?.items?.length <= 0 && <Empty />}
                    </div>
                )}

                {watchDeal === DSP_DEAL.DIRECT && (
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

            <div className="flex justify-end gap-2">
                {watchDeal == DSP_DEAL.DIRECT && (
                    <Button
                        onClick={(e) => {
                            handleTestConnection();
                        }}
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
                    loading={isActive}
                    type="primary"
                    onClick={(e) => form?.submit()}
                >
                    {messages('common.submit')}
                </Button>
            </div>
        </Spin>
    );
}
