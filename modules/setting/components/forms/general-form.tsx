import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { DATE_FORMAT } from '@/enums/common';
import { convertSecondsToHHMMSS, timeStringToSeconds } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { Form, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function GeneralForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingData } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const generalConfig = settingData?.general;

    const onFinish = (values: any) => {
        try {
            active();
            const previewTimeString = values.preview.format(
                DATE_FORMAT.HOUR_MINUTE_SECOND
            );
            const sampleLengthTimeString = values.sampleLength.format(
                DATE_FORMAT.HOUR_MINUTE_SECOND
            );
            const payload: UpdateSettingPayload = {
                general: {
                    ...values,
                    preview: timeStringToSeconds(previewTimeString),
                    sampleLength: timeStringToSeconds(sampleLengthTimeString),
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
            ...generalConfig,
            sampleLength: dayjs(
                convertSecondsToHHMMSS(generalConfig?.sampleLength),
                DATE_FORMAT.HOUR_MINUTE_SECOND
            ),
            preview: dayjs(
                convertSecondsToHHMMSS(generalConfig?.preview),
                DATE_FORMAT.HOUR_MINUTE_SECOND
            ),
        });
    }, [form, generalConfig]);

    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem
                    name="sampleLength"
                    label={messages('track.sampleLength.label')}
                    tooltipInfo={messages('track.sampleLength.tooltip')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TimePicker
                        className="w-full"
                        showNow={false}
                        format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                        allowClear={false}
                    />
                </AppFormItem>
                <AppFormItem
                    name="preview"
                    label={messages('track.preview.label')}
                    tooltipInfo={messages('track.preview.tooltip')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TimePicker
                        className="w-full"
                        showNow={false}
                        format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                        allowClear={false}
                    />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
