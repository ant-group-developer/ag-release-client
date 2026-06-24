import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber, Radio, Spin, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { TYPE_MODAL_ENRICH_SCAN_SCHEDULE } from '../../enums';
import { useCreateEnrichScanSchedule } from '../../hooks/use-create';
import { useUpdateEnrichScanSchedule } from '../../hooks/use-update';
import { EnrichScanScheduleData } from '../../types';
import {
    CreateEnrichScanSchedulePayload,
    UpdateEnrichScanSchedulePayload,
} from '../../types/payload';

type EnrichScanScheduleFormValues = {
    name: string;
    enabled: boolean;
    timezone: string;
    isImportedFromReport: boolean;
    limitCount: number;
    force: boolean;
};

type Props = Omit<AppModalProps, 'children'>;

export default function EnrichScanScheduleForm({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<EnrichScanScheduleFormValues>();
    const { active, deActive, isActive } = useActive();
    const [cronValue, setCronValue] = useState<string>('0 2 * * *');

    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<EnrichScanScheduleData>(
        (state) => state.dataEdit
    );
    const isUpdateForm = typeModal === TYPE_MODAL_ENRICH_SCAN_SCHEDULE.UPDATE;

    const { createEnrichScanSchedule, isPending: isCreatePending } =
        useCreateEnrichScanSchedule();
    const { updateEnrichScanSchedule, isPending: isUpdatePending } =
        useUpdateEnrichScanSchedule();

    const buildPayload = (
        values: EnrichScanScheduleFormValues
    ): CreateEnrichScanSchedulePayload => ({
        name: values.name,
        enabled: values.enabled,
        cronExpression: cronValue,
        timezone: values.timezone,
        isImportedFromReport: values.isImportedFromReport,
        limitCount: values.limitCount,
        force: values.force,
    });

    const handleCreate = (values: EnrichScanScheduleFormValues) => {
        const variables: CreateVariables<CreateEnrichScanSchedulePayload> = {
            payload: buildPayload(values),
            onSuccess: () => {
                form.resetFields();
                setCronValue('0 2 * * *');
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        createEnrichScanSchedule(variables);
    };

    const handleUpdate = (values: EnrichScanScheduleFormValues) => {
        const variables: UpdateVariables<
            EnrichScanScheduleData['id'],
            UpdateEnrichScanSchedulePayload
        > = {
            id: dataEdit?.id,
            payload: buildPayload(values),
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        updateEnrichScanSchedule(variables);
    };

    const onFinish = (values: EnrichScanScheduleFormValues) => {
        active();
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    useEffect(() => {
        if (isUpdateForm && dataEdit) {
            form.setFieldsValue({
                name: dataEdit.name,
                enabled: !!dataEdit.enabled,
                timezone: dataEdit.timezone,
                isImportedFromReport: !!dataEdit.isImportedFromReport,
                limitCount: dataEdit.limitCount ?? 500,
                force: !!dataEdit.force,
            });
            if (dataEdit.cronExpression) {
                setCronValue(dataEdit.cronExpression);
            }
        } else if (!isUpdateForm) {
            form.setFieldsValue({
                enabled: true,
                timezone: 'Asia/Ho_Chi_Minh',
                isImportedFromReport: true,
                limitCount: 500,
                force: false,
            });
            setCronValue('0 2 * * *');
        }
    }, [isUpdateForm, form, dataEdit]);

    const modalTitle = isUpdateForm
        ? messages('reportConfigs.enrichScanSchedules.action.update')
        : messages('reportConfigs.enrichScanSchedules.action.create');

    return (
        <AppModal
            {...props}
            open
            centered
            title={modalTitle}
            width={600}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
        >
            <Spin spinning={isCreatePending || isUpdatePending}>
                <AppForm
                    form={form}
                    showSubmit={false}
                    onFinish={onFinish}
                    layout="vertical"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="name"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.name'
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    {/* <AppFormItem
                        name="timezone"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.timezone'
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <TimezoneSelect />
                    </AppFormItem> */}

                    <AppFormItem
                        label={messages(
                            'reportConfigs.enrichScanSchedules.cronExpression'
                        )}
                        required
                    >
                        <Cron
                            value={cronValue}
                            setValue={setCronValue}
                            clearButtonProps={{ type: 'default' }}
                            disabled={isActive}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="limitCount"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.limitCount'
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="500"
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="isImportedFromReport"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.isImportedFromReport'
                        )}
                        tooltipInfo={messages(
                            'reportConfigs.enrichScanSchedules.isImportedFromReportTooltip'
                        )}
                    >
                        <Radio.Group>
                            <Radio value={false}>
                                {messages(
                                    'reportConfigs.enrichScanSchedules.isImportedFromReportDirect'
                                )}
                            </Radio>
                            <Radio value={true}>
                                {messages(
                                    'reportConfigs.enrichScanSchedules.isImportedFromReportImport'
                                )}
                            </Radio>
                        </Radio.Group>
                    </AppFormItem>

                    <AppFormItem
                        name="force"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.force'
                        )}
                        tooltipInfo={messages(
                            'reportConfigs.enrichScanSchedules.forceTooltip'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="enabled"
                        label={messages(
                            'reportConfigs.enrichScanSchedules.enabled'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </AppFormItem>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
