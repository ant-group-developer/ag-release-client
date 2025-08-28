import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateReleaseType } from '../../hooks/use-create-release-type';
import { useUpdateReleaseType } from '../../hooks/use-update-release-type';
import { ReleaseTypesData } from '../../types';
import {
    CreateReleaseTypePayload,
    UpdateReleaseTypePayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function ReleaseTypeFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as ReleaseTypesData
    );

    // const
    const isUpdateForm = dataEdit?.id;

    // apis
    const { createReleaseType } = useCreateReleaseType();
    const { updateReleaseType } = useUpdateReleaseType();

    // func
    const handleCreateReleaseType = (values: any) => {
        const variables: CreateVariables<CreateReleaseTypePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createReleaseType(variables);
    };
    const handleUpdateReleaseType = (values: any) => {
        const variables: UpdateVariables<
            ReleaseTypesData['id'],
            UpdateReleaseTypePayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };

        updateReleaseType(variables);
    };
    const onFinish = (values: any) => {
        active();
        return isUpdateForm
            ? handleUpdateReleaseType(values)
            : handleCreateReleaseType(values);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={500}
            {...props}
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} `}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
            >
                <AppFormItem
                    name="name"
                    label={messages('trackType.label')}
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
                                field: messages('trackType.label'),
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
                    name="minTrackCount"
                    label={messages('track.minTrack')}
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
                    name="maxTrackCount"
                    label={messages('track.maxTrack')}
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
            </AppForm>
        </AppModal>
    );
}
