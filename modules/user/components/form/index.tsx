import { Button, DatePicker, Input, Switch } from 'antd';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting';
import { Form, Spin } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUpdateUser } from '../../hooks/use-update-user';
import { UpdateUserPayload } from '../../types/data';

type Props = {};

export default function UserForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const loading = useLoading(UseLoadingType.Mutating);
    const { profile } = useAuth();
    const { updateUser } = useUpdateUser();
    const { active, isActive, deActive } = useActive();
    const { data: dataSetting } = useGetSettingPublic();

    const onFinish = async (values: UpdateUserPayload) => {
        active();
        const variables = {
            payload: {
                ...values,
                dateOfBirth: values.dateOfBirth
                    ? formattedDate(
                          values.dateOfBirth,
                          DATE_FORMAT.MYSQL_TYPE_DATE
                      )
                    : null,
                telegramId: values.telegramId == '' ? null : values.telegramId,

                phoneNumber:
                    values.phoneNumber == '' ? null : values.phoneNumber,
            },
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateUser(variables);
    };

    useEffect(() => {
        if (profile?.id) {
            form.setFieldsValue({
                name: profile?.name,
                phoneNumber: profile?.phoneNumber,
                dateOfBirth: profile?.dateOfBirth
                    ? dayjs(profile.dateOfBirth, DATE_FORMAT.MYSQL_TYPE_DATE)
                    : null,
                telegramId: profile?.telegramId,
                telegramNotificationEnabled:
                    profile?.telegramNotificationEnabled,
            });
        }
    }, [profile, form]);
    if (!profile) {
        return <Spin />;
    }
    return (
        <div className="w-[650px] px-2">
            {loading ||
                (isActive && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Spin />
                    </div>
                ))}
            <AppForm
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                submitProps={{}}
                disabled={isActive}
            >
                <AppFormItem
                    name="name"
                    label={messages('user.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="phoneNumber"
                    label={messages('user.phoneNumber')}
                    rules={[
                        {
                            pattern: /^\d{10}$/,
                            message: messages('validation.phoneNumber'),
                        },
                    ]}
                >
                    <Input
                        placeholder={messages('validation.inputPhoneNumber')}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="\d*"
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^\d]/g,
                                ''
                            );
                        }}
                        allowClear
                    />
                </AppFormItem>
                <AppFormItem
                    name="dateOfBirth"
                    label={messages('user.birthday')}
                >
                    <DatePicker
                        className="w-full"
                        disabledDate={(current) =>
                            current && current >= dayjs().startOf('day')
                        }
                        format={DATE_FORMAT.DATE_ONLY}
                    />
                </AppFormItem>
                <AppFormItem name="telegramId" label={'Telegram ID'}>
                    <div className="flex flex-col gap-1 lg:flex-row">
                        <AppFormItem name="telegramId" noStyle>
                            <Input
                                allowClear
                                placeholder={messages('validation.input')}
                            />
                        </AppFormItem>
                        {dataSetting?.linkStartBot && (
                            <Button
                                type="default"
                                href={dataSetting?.linkStartBot}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {messages('user.clickHereToGetTelegramId')}
                            </Button>
                        )}
                    </div>
                </AppFormItem>
                <AppFormItem
                    name="telegramNotificationEnabled"
                    label={messages('common.notification')}
                >
                    <Switch
                        defaultValue={false}
                        checkedChildren={messages('status.on')}
                        unCheckedChildren={messages('status.off')}
                    />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
