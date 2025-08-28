import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN, WEEK_DAY } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { useFilter } from '@/hooks/use-filter';
import { useListBackupDatabaseLogs } from '@/modules/backup-dabatase/hooks/use-get-backup-database-logs';
import { BackupDatabaseLogDataFilter } from '@/modules/backup-dabatase/types';
import { Checkbox, Divider, Form, InputNumber, Select } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { EXECUTE_CYCLE_TYPE } from '../../types';
import { UpdateSettingPayload } from '../../types/payload';
import BackupDatabaseHeader from '../header';
import { BackupDatabaseLogTable } from '../table/backup-database-table';

type Props = {};

export default function BackupDatabaseForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const [value, setValue] = useState('30 5 * * 1,6');
    const { settingData } = useGetSetting();
    const backupDatabase = settingData?.backupDatabase;
    const { updateSetting } = useUpdateSetting();

    const { active, deActive, isActive } = useActive();
    const executeCycle = useWatch('executeCycleType', form);
    const nHours = useWatch('nHours', form);
    const nDays = useWatch('nDays', form);
    const nMinutes = useWatch('nMinutes', form);
    const dayOfWeek = useWatch('dayOfWeek', form);
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<BackupDatabaseLogDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { backupDatabaseLogsData, isFetching, refetch, dataUpdatedAt } =
        useListBackupDatabaseLogs(dataFilter);

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
                    days: nDays ?? 0,
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

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
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
                submitText={messages('action.update.button')}
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
                <AppFormItem label={messages('setting.executeCycle')}>
                    <Cron value={value} setValue={setValue} />
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
                <AppFormItem label={messages('setting.databaseBackupStorage')}>
                    <div className="flex gap-8">
                        <AppFormItem name="toDrive" valuePropName="checked">
                            <Checkbox>Google Drive </Checkbox>
                        </AppFormItem>
                        <AppFormItem name="toGcs" valuePropName="checked">
                            <Checkbox>Google Cloud Storage</Checkbox>
                        </AppFormItem>
                    </div>
                </AppFormItem>
            </AppForm>
            <Divider />
            <div>
                <div className="flex justify-between py-2 font-semibold">
                    <span>Backup database logs</span>
                </div>
                <div>
                    <BackupDatabaseHeader
                        dataFilter={dataFilter}
                        onSearch={onSearch}
                    />
                    <BackupDatabaseLogTable
                        pagination={{
                            pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                            current: dataFilter?.page ?? 1,
                        }}
                        scroll={{
                            x: SCREEN.MD,
                            y: 300,
                        }}
                        dataSource={backupDatabaseLogsData?.items}
                        loading={isFetching}
                        onChange={onChangeSort}
                        dataFilter={dataFilter}
                    />
                    <AppPagination
                        className="border-b"
                        align="end"
                        current={dataFilter?.page}
                        pageSize={dataFilter.pageSize}
                        total={backupDatabaseLogsData.metadata?.totalItems}
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
                </div>
            </div>
        </div>
    );
}
