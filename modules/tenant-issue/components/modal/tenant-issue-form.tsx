import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TenantSelect from '@/components/ui/select/tenant-select';
import { MAX_NOTE_LENGTH } from '@/constants/validate';
import { getNameByLocale } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListSimpleIssue } from '@/modules/issues/hooks/use-get-simple-list';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, InputNumber, Select, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTenantIssue } from '../../hooks/use-create';
import { useUpdateTenantIssue } from '../../hooks/use-update';
import { TenantIssueData } from '../../types';
import {
    CreateTenantIssuePayload,
    UpdateTenantIssuePayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TenantIssueFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { issueSimpleData } = useGetListSimpleIssue();
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();

    const dataEdit = useModalStore(
        (state) => state.dataEdit as TenantIssueData
    );
    const isUpdateModal = dataEdit?.id;
    const options = issueSimpleData.map((item) => ({
        id: item.id,
        value: item.id,
        name: getNameByLocale(item?.nameEn, item?.nameVi, locale),
        label: (
            <p className="flex items-center justify-between gap-1">
                <span>
                    {getNameByLocale(item?.nameEn, item?.nameVi, locale)}
                </span>
            </p>
        ),
    }));
    const issueId = useWatch('issueId', form);
    const currentIssue = issueSimpleData?.find((item) => item.id == issueId);

    const { createTenantIssue } = useCreateTenantIssue();
    const { updateTenantIssue } = useUpdateTenantIssue();

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<
            TenantIssueData['id'],
            UpdateTenantIssuePayload
        > = {
            id: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateTenantIssue(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateTenantIssuePayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createTenantIssue(variables);
    };

    const onFinish = async (values: any) => {
        const { ...res } = values;
        active();
        const payloadValues = {
            ...res,
        };
        return isUpdateModal
            ? handleUpdate(payloadValues)
            : handleCreate(payloadValues);
    };

    useEffect(() => {
        if (dataEdit?.id) {
            const initialData = {
                ...dataEdit,
                dateAffect: [
                    dayjs(dataEdit?.startDateAffect),
                    dayjs(dataEdit?.endDateAffect),
                ],
            };
            form.setFieldsValue(initialData);
        } else {
            if (!currentIssue) return;

            const startDateAffect = dayjs();
            const endDateAffect = dayjs().add(
                currentIssue?.numberOfDaysAffect ?? 0,
                'day'
            );
            const score = currentIssue?.score;
            const initialData = {
                dateAffect: [dayjs(startDateAffect), dayjs(endDateAffect)],
                score,
                isActive: false,
            };
            form.setFieldsValue(initialData);
        }
    }, [dataEdit, issueId, currentIssue, form]);

    return (
        <AppModal
            width={600}
            {...props}
            className="!top-4"
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('tenantIssue.label').toLowerCase()}`}
            open
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
            >
                <AppFormItem
                    name="tenantId"
                    label={messages('tenant.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TenantSelect />
                </AppFormItem>

                <AppFormItem
                    name="issueId"
                    label={messages('issue.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Select options={options} />
                </AppFormItem>

                <AppFormItem
                    name="score"
                    label={messages('common.score')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber className="!w-full" />
                </AppFormItem>

                <AppFormItem
                    name="dateAffect"
                    label={messages('common.dateAffect')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <DateRangePicker className="w-full" />
                </AppFormItem>

                <AppFormItem
                    name="isActive"
                    label={messages('status.active')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Switch />
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: messages('common.description'),
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            minRows: 3,
                            maxRows: 7,
                        }}
                        showCount
                    />
                </AppFormItem>
                <AppFormItem
                    className="!mb-6"
                    name="note"
                    label={messages('common.note')}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: messages('common.note'),
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            minRows: 3,
                            maxRows: 7,
                        }}
                        showCount
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
