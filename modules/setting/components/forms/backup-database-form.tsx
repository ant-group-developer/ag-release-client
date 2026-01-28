import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { useFilter } from '@/hooks/use-filter';
import { useListBackupDatabaseLogs } from '@/modules/backup-dabatase/hooks/use-get-backup-database-logs';
import { BackupDatabaseLogDataFilter } from '@/modules/backup-dabatase/types';
import { Checkbox, Divider, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';
import BackupDatabaseHeader from '../header';
import { BackupDatabaseLogTable } from '../table/backup-database-table';

type Props = {};

export default function BackupDatabaseForm({}: Props) {
    const messages = useTranslations();
    const { settingData } = useGetSetting();
    const backupDatabase = settingData?.backupDatabase;
    const [form] = Form.useForm();
    const [cronValue, setCronValue] = useState(backupDatabase?.cronValue);
    const { updateSetting } = useUpdateSetting();

    const { active, deActive, isActive } = useActive();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<BackupDatabaseLogDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { backupDatabaseLogsData, isFetching, refetch, dataUpdatedAt } =
        useListBackupDatabaseLogs(dataFilter);

    const onFinish = (values: any) => {
        try {
            active();
            const { nMinutes, nHours, nDays, dayOfWeek, ...rest } = values;
            const payload: UpdateSettingPayload = {
                backupDatabase: {
                    ...rest,
                    cronValue,
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
            >
                <AppFormItem label={messages('setting.executeCycle')}>
                    <Cron
                        value={cronValue}
                        setValue={setCronValue}
                        clearButtonProps={{ type: 'default' }}
                        disabled={isActive}
                    />
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
                <AppFormItem
                    label={messages('setting.backupFileName')}
                    name="fileName"
                >
                    <Input />
                </AppFormItem>
                <AppFormItem label={'Shell'} name="shell">
                    <Input />
                </AppFormItem>
            </AppForm>
            <Divider />
            <div>
                <div className="flex justify-between py-2 font-semibold">
                    <span>Backup database logs</span>
                </div>
                <div className="rounded-lg border">
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
