import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import IssueLevelSelect from '@/components/ui/select/issue-level-select';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateIssue } from '../../hooks/use-create';
import { useUpdateIssue } from '../../hooks/use-update';
import { IssueData } from '../../types';
import { CreateIssuePayload, UpdateIssuePayload } from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function IssueFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as IssueData);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createIssue } = useCreateIssue();
    const { updateIssue } = useUpdateIssue();

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<IssueData['id'], UpdateIssuePayload> =
            {
                id: dataEdit?.id,
                payload: value,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            };
        updateIssue(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateIssuePayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createIssue(variables);
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
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={600}
            {...props}
            className="!top-4"
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('issue.label').toLowerCase()}`}
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
                    name="nameVi"
                    label={`${messages('issue.name')} Vi`}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('issue.name'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="nameEn"
                    label={`${messages('issue.name')} En`}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('issue.name'),
                            }),
                        },
                    ]}
                >
                    <Input
                        allowClear
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setFieldValue('code', getCodeFormatted(value));
                        }}
                    />
                </AppFormItem>
                <AppFormItem
                    name="code"
                    label={messages('common.code')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('common.code'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
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
                    name="numberOfDaysAffect"
                    label={messages('issue.numberOfDaysAffect')}
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
                    name="issueLevelId"
                    label={messages('issueLevel.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <IssueLevelSelect />
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
