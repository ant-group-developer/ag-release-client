import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppRadio from '@/components/ui/radio/app-radio';
import { SIZE_ICON_BIG } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { useGetListAggregator } from '@/modules/aggregator/hooks/use-get-list';
import { CreateVariables } from '@/types/api';
import { CheckCard } from '@ant-design/pro-components';
import {
    Button,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Radio,
    Spin,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { LayoutList, UserCog } from 'lucide-react';
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

    const { dspRoutingConfig } = useGetDspRoutingConfig(dspId);
    const { aggregatorsData, isFetching } = useGetListAggregator({});
    const { updateDspRoutingConfig } = useUpdateDspRoutingConfig();

    const onFinish = (values: any) => {
        active();
        const variables: CreateVariables<UpdateDspRoutingConfig> = {
            payload: {
                dspId,
                ...values,
            },
            onSuccess(e) {
                deActive();
            },
            onError(e) {
                deActive();
            },
        };
        updateDspRoutingConfig(variables);
    };

    useEffect(() => {
        form?.setFieldsValue(dspRoutingConfig);
    }, [dspRoutingConfig]);

    return (
        <Spin spinning={isFetching}>
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
                            <Radio.Group className="!grid grid-cols-2 gap-2">
                                {aggregatorsData?.items?.map((item) => {
                                    return (
                                        <AppRadio
                                            key={item?.id}
                                            // avatar="/icon/spotify.png"
                                            // description="Your connection credentials will be entered by your Account Manager. Please make sure that you have filled out."
                                            className="!h-full !w-full"
                                            onClick={() => {
                                                console.log('clicked');
                                            }}
                                            value={item?.id}
                                        >
                                            {/* <Avatar
                                                size={'default'}
                                                src="/icon/spotify.png"
                                            /> */}
                                            <span className="ml-1">
                                                {item?.name}
                                            </span>
                                        </AppRadio>
                                    );
                                })}
                            </Radio.Group>
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
                                min={0}
                                placeholder="Enter 21 unless you received other instructions"
                                style={{ width: '100%' }}
                            />
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
                    </>
                )}
            </AppForm>

            <div className="flex justify-end">
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
