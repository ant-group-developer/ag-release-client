import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { useActive } from '@/hooks/use-active';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { Form, Input, InputNumber, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function ACRCloudForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingData } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const acrCloudConfigData = settingData?.acrCloud;

    const onFinish = (values: any) => {
        try {
            active();
            const { autoScanTime, scoreWarning, chunkDuration, ...rest } =
                values;
            const payload: UpdateSettingPayload = {
                acrCloud: {
                    ...rest,
                    autoScanTime: formattedDate(
                        autoScanTime,
                        DATE_FORMAT.HOUR_MINUTE
                    ),
                    scoreWarning: Number(scoreWarning),
                    chunkDuration: Number(chunkDuration),
                },
            };
            updateSetting({
                payload,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            });
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            ...acrCloudConfigData,
            autoScanTime: acrCloudConfigData?.autoScanTime
                ? dayjs(acrCloudConfigData.autoScanTime, 'HH:mm')
                : null,
        });
    }, [form, acrCloudConfigData]);
    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem
                    name="acrHost"
                    label="ACR host"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'ACRHost',
                            }),
                        },
                    ]}
                >
                    <Input.Password />
                </AppFormItem>
                <AppFormItem
                    name="acrAccessKey"
                    label="ACR access key"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'ACR accessKey',
                            }),
                        },
                    ]}
                >
                    <Input.Password />
                </AppFormItem>
                <AppFormItem
                    name="acrAccessSecret"
                    label="ACR access secret"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'ACR accessSecret',
                            }),
                        },
                    ]}
                >
                    <Input.Password />
                </AppFormItem>
                <AppFormItem
                    required
                    name="releaseStatusAutoScans"
                    label={
                        <span className="text-wrap pb-4">
                            {messages('tracks.releaseStatusAutoScan')}
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        options={Object.values(RELEASES_STATUS).map((item) => ({
                            label: messages(getIntlCodeByReleaseStatus(item)),
                            value: item,
                        }))}
                        allowClear
                    />
                </AppFormItem>
                <AppFormItem
                    name="chunkDuration"
                    label={'Chunk duration'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: messages('validation.numberMin', {
                                min: 1,
                                field: 'Chunk duration',
                            }),
                        },
                        {
                            type: 'number',
                            max: 12,
                            message: messages('validation.numberMax', {
                                max: 12,
                                field: 'Chunk duration',
                            }),
                        },
                    ]}
                >
                    <InputNumber className="!w-full" />
                </AppFormItem>
                <AppFormItem
                    name="scoreWarning"
                    label={messages('tracks.scoreWarning')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: messages('validation.numberMin', {
                                min: 1,
                                field: messages('tracks.scoreWarning'),
                            }),
                        },
                        {
                            type: 'number',
                            max: 100,
                            message: messages('validation.numberMax', {
                                max: 100,
                                field: messages('tracks.scoreWarning'),
                            }),
                        },
                    ]}
                >
                    <InputNumber className="!w-full" />
                </AppFormItem>

                <AppFormItem
                    name="autoScanTime"
                    label={messages('tracks.autoScanTime')}
                >
                    <TimePicker
                        format="HH:mm"
                        showSecond={false}
                        className="!w-full"
                    />
                </AppFormItem>
                <AppFormItem
                    name="autoScan"
                    label={messages('tracks.autoScan')}
                    valuePropName="checked"
                >
                    <Switch defaultChecked={false} />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
