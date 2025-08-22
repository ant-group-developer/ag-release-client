import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { SCREEN, WEEK_DAY } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import { useListBackupDatabaseLogs } from '@/modules/backup-dabatase/hooks/use-get-backup-database-logs';
import { Checkbox, Form, InputNumber, Select } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { EXECUTE_CYCLE_TYPE } from '../../types';
import { UpdateSettingPayload } from '../../types/payload';
import { BackupDatabaseLogTable } from '../table/backup-database-table';

type Props = {};

export default function BackupDatabaseForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingData } = useGetSetting();
    const backupDatabase = settingData?.backupDatabase;
    const { updateSetting } = useUpdateSetting();
    const { backupDatabaseLogsData } = useListBackupDatabaseLogs();
    const { active, deActive, isActive } = useActive();
    const executeCycle = useWatch('executeCycleType', form);
    const nHours = useWatch('nHours', form);
    const nDays = useWatch('nDays', form);
    const nMinutes = useWatch('nMinutes', form);
    const dayOfWeek = useWatch('dayOfWeek', form);

    const scheduleOptions = [
        { label: 'Daily', value: EXECUTE_CYCLE_TYPE.DAILY },
        { label: 'N Days', value: EXECUTE_CYCLE_TYPE.N_DAYS },
        { label: 'Hourly', value: EXECUTE_CYCLE_TYPE.HOURLY },
        { label: 'N Hours', value: EXECUTE_CYCLE_TYPE.N_HOURS },
        { label: 'N Minutes', value: EXECUTE_CYCLE_TYPE.N_MINUTES },
        { label: 'Weekly', value: EXECUTE_CYCLE_TYPE.WEEKLY },
        { label: 'Monthly', value: EXECUTE_CYCLE_TYPE.MONTHLY },
    ];

    const weekOptions = [
        { label: 'Monday', value: WEEK_DAY.MONDAY },
        { label: 'Tuesday', value: WEEK_DAY.TUESDAY },
        { label: 'Wednesday', value: WEEK_DAY.WEDNESDAY },
        { label: 'Thursday', value: WEEK_DAY.THURSDAY },
        { label: 'Friday', value: WEEK_DAY.FRIDAY },
        { label: 'Saturday', value: WEEK_DAY.SATURDAY },
        { label: 'Sunday', value: WEEK_DAY.SUNDAY },
    ];

    const showDays = executeCycle === EXECUTE_CYCLE_TYPE.N_DAYS;
    const showHours = executeCycle !== EXECUTE_CYCLE_TYPE.HOURLY;
    const showWeekDays = executeCycle == EXECUTE_CYCLE_TYPE.WEEKLY;

    const messagesExecuteCycle = () => {
        switch (executeCycle) {
            case EXECUTE_CYCLE_TYPE.DAILY:
                return messages('setting.executeMessages.daily', {
                    at: `${nHours ?? 0}:${nMinutes ?? 0}`,
                });
            case EXECUTE_CYCLE_TYPE.N_DAYS:
                return messages('setting.executeMessages.nDays', {
                    days: nDays,
                    at: `${nHours ?? 0}:${nMinutes ?? 0}`,
                });

            case EXECUTE_CYCLE_TYPE.HOURLY:
                return messages('setting.executeMessages.hourly', {
                    minute: nMinutes ?? 0,
                });

            case EXECUTE_CYCLE_TYPE.N_HOURS:
                return messages('setting.executeMessages.nHours', {
                    hour: nHours ?? 0,
                    minute: nMinutes ?? 0,
                });

            case EXECUTE_CYCLE_TYPE.N_MINUTES:
                return messages('setting.executeMessages.nMinutes', {
                    minutes: nMinutes ?? 0,
                });

            case EXECUTE_CYCLE_TYPE.WEEKLY:
                return messages('setting.executeMessages.weekly', {
                    dayOfWeek: messages(
                        `weekDays.${dayOfWeek?.toLowerCase()}` as any
                    ),
                    hours: nHours ?? 0,
                    minutes: nMinutes ?? 0,
                });

            case EXECUTE_CYCLE_TYPE.MONTHLY:
                return messages('setting.executeMessages.monthly', {
                    days: nDays ?? 1,
                    hours: nHours ?? 0,
                    minutes: nMinutes ?? 0,
                });

            default:
                return '';
        }
    };

    const onFinish = (values: any) => {
        try {
            active();
            const { nMinutes, nHours, nDays, dayOfWeek, ...rest } = values;
            const payload: UpdateSettingPayload = {
                backupDatabase: {
                    ...rest,
                    executeConfig: {
                        nDays,
                        nHours,
                        nMinutes,
                        dayOfWeek,
                    },
                },
            };
            console.log('🚀 ~ onFinish ~ payload:', payload);
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
            ...backupDatabase,
        });
    }, [form, backupDatabase]);

    return (
        <div className="space-y-4">
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
                initialValues={{
                    executeCycleType: EXECUTE_CYCLE_TYPE.DAILY,
                    dayOfWeek: WEEK_DAY.MONDAY,
                }}
            >
                <AppFormItem label={messages('setting.executeCycle')}>
                    <div className="grid grid-cols-4 gap-8 pb-4">
                        <AppFormItem name="executeCycleType" required>
                            <Select
                                options={scheduleOptions}
                                className="max-w-36"
                            />
                        </AppFormItem>
                        {showWeekDays && (
                            <AppFormItem name="dayOfWeek" required>
                                <Select options={weekOptions} />
                            </AppFormItem>
                        )}
                        {showDays && (
                            <AppFormItem
                                name="nDays"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <InputNumber
                                    addonAfter={messages('date.day.label')}
                                />
                            </AppFormItem>
                        )}
                        {showHours && (
                            <AppFormItem
                                name="nHours"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                    {
                                        type: 'number',
                                        min: 1,
                                        message: messages(
                                            'validation.numberMin',
                                            {
                                                min: 1,
                                                field: messages('common.hours'),
                                            }
                                        ),
                                    },
                                    {
                                        type: 'number',
                                        max: 24,
                                        message: messages(
                                            'validation.numberMax',
                                            {
                                                max: 24,
                                                field: messages('common.hours'),
                                            }
                                        ),
                                    },
                                ]}
                            >
                                <InputNumber
                                    addonAfter={messages('date.hour.label')}
                                />
                            </AppFormItem>
                        )}
                        <AppFormItem
                            name="nMinutes"
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
                                        field: messages('common.minutes'),
                                    }),
                                },
                                {
                                    type: 'number',
                                    max: 60,
                                    message: messages('validation.numberMax', {
                                        max: 60,
                                        field: messages('common.minutes'),
                                    }),
                                },
                            ]}
                        >
                            <InputNumber
                                width={20}
                                addonAfter={messages('date.minute.label')}
                            />
                        </AppFormItem>
                        <span className="absolute bottom-[-4px] left-[0] text-wrap">
                            {messagesExecuteCycle()}
                        </span>
                    </div>
                </AppFormItem>
                <AppFormItem label={messages('setting.backupNotification')}>
                    <div className="flex gap-8">
                        <AppFormItem
                            name="notifyOnSuccess"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                {messages('setting.notifyOnSuccess')}
                            </Checkbox>
                        </AppFormItem>
                        <AppFormItem
                            name="notifyOnFailed"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                {messages('setting.notifyOnFailed')}
                            </Checkbox>
                        </AppFormItem>
                    </div>
                </AppFormItem>
                <AppFormItem label="Backup database">
                    <div className="flex gap-8">
                        <AppFormItem name="toDrive" valuePropName="checked">
                            <Checkbox>Google drive </Checkbox>
                        </AppFormItem>
                        <AppFormItem name="toGcs" valuePropName="checked">
                            <Checkbox>Google cloud storage</Checkbox>
                        </AppFormItem>
                    </div>
                </AppFormItem>
            </AppForm>
            <div>
                <p className="py-2 font-semibold">Backup database logs</p>
                <BackupDatabaseLogTable
                    className="rounded-md border"
                    pagination={{ pageSize: 20, current: 1 }}
                    scroll={{
                        x: SCREEN.MD,
                    }}
                    dataSource={backupDatabaseLogsData?.items}
                />
            </div>
        </div>
    );
}
