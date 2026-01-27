import AppFormItem from '@/components/ui/antd-form/form-Item';
import { SIZE_ICON_BIG } from '@/constants/common';
import { useGetListAggregator } from '@/modules/aggregator/hooks/use-get-list';
import { CheckCard } from '@ant-design/pro-components';
import { Alert, FormInstance, Input, InputNumber, Spin } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance<any>;
    isActive: boolean;
};

export default function DspDeals({ form, isActive }: Props) {
    const messages = useTranslations();
    const watchDeal = useWatch('deal', form);

    const { aggregatorsData, isFetching } = useGetListAggregator({});

    return (
        <Spin spinning={isFetching}>
            <AppFormItem
                layout="vertical"
                wrapperCol={{ span: 24 }}
                name={'deal'}
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
                        avatar={<UserCog size={SIZE_ICON_BIG} />}
                        title={<span>Direct deal</span>}
                        value={'direct'}
                    />

                    {aggregatorsData?.items?.map((item) => {
                        return (
                            <CheckCard
                                key={item?.id}
                                className="!m-0 !w-full"
                                // avatar={<Settings size={SIZE_ICON_BIG} />}
                                title={<span>{item?.name}</span>}
                                value={item?.id}
                            />
                        );
                    })}
                </CheckCard.Group>
            </AppFormItem>

            {watchDeal !== 'direct' && (
                <Alert
                    className="!rounded-lg"
                    banner
                    type="info"
                    showIcon
                    description={'Description'}
                />
            )}

            {watchDeal === 'direct' && (
                <>
                    <AppFormItem
                        label="Host/Server address"
                        name={'host'}
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
                        name={'port'}
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
                        name={'username'}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input autoComplete="off" placeholder="Enter name" />
                    </AppFormItem>
                    <AppFormItem label="Password" name={'password'}>
                        <Input.Password
                            autoComplete="off"
                            placeholder="Enter password"
                        />
                    </AppFormItem>
                </>
            )}
        </Spin>
    );
}
