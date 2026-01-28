import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppRadio from '@/components/ui/radio/app-radio';
import { SIZE_ICON_BIG } from '@/constants/common';
import { useGetListAggregator } from '@/modules/aggregator/hooks/use-get-list';
import { CheckCard } from '@ant-design/pro-components';
import {
    Avatar,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Radio,
    Spin,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { Building2, Settings, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { DSP_DEAL } from '../../enums';
import { useGetDspRoutingConfig } from '../../hooks/use-get-dsp-routing-config';

type Props = {
    isActive: boolean;
    dspId: string;
};

export default function DspDeals({ isActive, dspId }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const watchDeal = useWatch('mode', form);

    const { dspRoutingConfig } = useGetDspRoutingConfig(dspId);
    console.log('🚀 ~ DspDeals ~ dspRoutingConfig:', dspRoutingConfig);
    const { aggregatorsData, isFetching } = useGetListAggregator({});

    useEffect(() => {
        form?.setFieldsValue(dspRoutingConfig);
    }, [dspRoutingConfig]);

    return (
        <Spin spinning={isFetching}>
            <AppForm showSubmit={false}>
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
                        <CheckCard
                            className="!m-0 !w-full"
                            avatar={<Settings size={SIZE_ICON_BIG} />}
                            title={
                                <span>
                                    {messages('aggregator.systemDefault')}
                                </span>
                            }
                            value={DSP_DEAL.SYSTEM_DEFAULT}
                        />
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
                            avatar={<Building2 size={SIZE_ICON_BIG} />}
                            title={
                                <span>
                                    {messages('aggregator.aggregators')}
                                </span>
                            }
                            value={DSP_DEAL.AGGREGATOR}
                        />

                        {/* {aggregatorsData?.items?.map((item) => {
                            return (
                                <CheckCard
                                    key={item?.id}
                                    className="!m-0 !w-full"
                                    // avatar={<Settings size={SIZE_ICON_BIG} />}
                                    title={<span>{item?.name}</span>}
                                    value={item?.id}
                                />
                            );
                        })} */}
                    </CheckCard.Group>
                </AppFormItem>

                <Divider />

                {watchDeal == DSP_DEAL.AGGREGATOR && (
                    <div>
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
                                        <Avatar
                                            size={'default'}
                                            src="/icon/spotify.png"
                                        />
                                        <span className="ml-1">
                                            {item?.name}
                                        </span>
                                    </AppRadio>
                                );
                            })}
                        </Radio.Group>
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
        </Spin>
    );
}
