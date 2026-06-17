import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Select, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_REPORT_CONFIG } from '../../enums';
import { useCreateReportConfig } from '../../hooks/use-create';
import { useGetDetailReportConfig } from '../../hooks/use-get-detail';
import { useUpdateReportConfig } from '../../hooks/use-update';
import { ReportConfigData } from '../../types';
import {
    CreateReportConfigPayload,
    UpdateReportConfigPayload,
} from '../../types/payload';

import { useGetListSimpleCurrencies } from '@/modules/currencies/hooks/use-get-list-simple-currencies';

type ReportConfigFormValues = Omit<
    CreateReportConfigPayload,
    'folderPatterns' | 'filePatterns' | 'requiredHeaders'
> & {
    folderPatterns?: string;
    filePatterns?: string;
    requiredHeaders?: string[];
};

type Props = Omit<AppModalProps, 'children'>;

const REPORT_TYPE_OPTIONS = [
    { label: 'Sales', value: 'sales' },
    { label: 'Trends', value: 'trends' },
    { label: 'Usage', value: 'usage' },
];

const normalizeTags = (value?: string[]) =>
    value?.map((item) => item.trim()).filter(Boolean) ?? [];

const normalizeTextArea = (value?: string) =>
    value
        ?.split('\n')
        .map((item) => item.trim())
        .filter(Boolean) ?? [];

export default function ReportConfigForm({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<ReportConfigFormValues>();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<ReportConfigData>((state) => state.dataEdit);
    const isUpdateForm = typeModal === TYPE_MODAL_REPORT_CONFIG.UPDATE;
    const reportConfigId = isUpdateForm ? dataEdit?.id : undefined;

    const { createReportConfig, isPending: isCreatePending } =
        useCreateReportConfig();
    const { updateReportConfig, isPending: isUpdatePending } =
        useUpdateReportConfig();
    const { reportConfigData, isFetching } =
        useGetDetailReportConfig(reportConfigId);
    const { currenciesData, isFetching: isFetchingCurrencies } =
        useGetListSimpleCurrencies();

    const currencyOptions = currenciesData.map((item) => ({
        label: `${item.code} - ${item.name}`,
        value: item.code,
    }));

    const buildPayload = (
        values: ReportConfigFormValues
    ): CreateReportConfigPayload => ({
        ...values,
        folderPatterns: normalizeTextArea(values.folderPatterns),
        filePatterns: normalizeTextArea(values.filePatterns),
        requiredHeaders: normalizeTags(values.requiredHeaders),
        delimiter: values.delimiter ?? ',',
        defaultCurrency: values.defaultCurrency ?? '',
        defaultMember: values.defaultMember ?? '',
        priority: values.priority ?? 1,
    });

    const handleCreate = (values: ReportConfigFormValues) => {
        const variables: CreateVariables<CreateReportConfigPayload> = {
            payload: buildPayload(values),
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        createReportConfig(variables);
    };

    const handleUpdate = (values: ReportConfigFormValues) => {
        const variables: UpdateVariables<
            ReportConfigData['id'],
            UpdateReportConfigPayload
        > = {
            id: dataEdit?.id,
            payload: buildPayload(values),
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        updateReportConfig(variables);
    };

    const onFinish = (values: ReportConfigFormValues) => {
        active();
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    useEffect(() => {
        if (isUpdateForm) {
            form.setFieldsValue({
                ...reportConfigData,
                folderPatterns:
                    reportConfigData?.folderPatterns?.join('\n') ?? '',
                filePatterns: reportConfigData?.filePatterns?.join('\n') ?? '',
                requiredHeaders: reportConfigData?.requiredHeaders ?? [],
            });
        }
    }, [isUpdateForm, form, reportConfigData]);

    const modalTitle = isUpdateForm
        ? messages('reportConfigs.action.update')
        : messages('reportConfigs.action.create');

    return (
        <AppModal
            {...props}
            open
            centered
            title={modalTitle}
            width={720}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 220px)',
                    overflowY: 'auto',
                    paddingRight: 8,
                },
            }}
        >
            <Spin spinning={isFetching}>
                <AppForm
                    form={form}
                    showSubmit={false}
                    onFinish={onFinish}
                    layout="vertical"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="sourceCode"
                        label={messages('reportConfigs.sourceCode')}
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

                    <AppFormItem
                        name="sourceName"
                        label={messages('reportConfigs.sourceName')}
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

                    <AppFormItem
                        name="reportType"
                        label={messages('reportConfigs.reportType')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select allowClear options={REPORT_TYPE_OPTIONS} />
                    </AppFormItem>

                    <AppFormItem
                        name="parserCode"
                        label={messages('reportConfigs.parserCode')}
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
                        name="delimiter"
                        label={messages('reportConfigs.delimiter')}
                    >
                        <Input maxLength={5} allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="priority"
                        label={messages('reportConfigs.priority')}
                    >
                        <InputNumber min={0} precision={0} />
                    </AppFormItem> */}

                    <AppFormItem
                        name="defaultCurrency"
                        label={messages('reportConfigs.defaultCurrency')}
                    >
                        <Select
                            allowClear
                            showSearch
                            options={currencyOptions}
                            loading={isFetchingCurrencies}
                            optionFilterProp="label"
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="defaultMember"
                        label={messages('reportConfigs.defaultMember')}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="folderPatterns"
                        label={messages('reportConfigs.folderPatterns')}
                        tooltipInfo={messages(
                            'reportConfigs.folderPatternsTooltip'
                        )}
                    >
                        <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            allowClear
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="filePatterns"
                        label={messages('reportConfigs.filePatterns')}
                        tooltipInfo={messages(
                            'reportConfigs.filePatternsTooltip'
                        )}
                    >
                        <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            allowClear
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="requiredHeaders"
                        label={messages('reportConfigs.requiredHeaders')}
                    >
                        <Select mode="tags" tokenSeparators={[',']} />
                    </AppFormItem>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
