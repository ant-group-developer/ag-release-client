import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTrackType } from '../../hooks/use-create-track-type';
import { useUpdateTrackType } from '../../hooks/use-update-track-type';
import { TrackTypeData } from '../../types';
import {
    CreateTrackTypePayload,
    UpdateTrackTypePayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TrackTypeFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as TrackTypeData);
    const isUpdateForm = dataEdit?.id;

    const { createTrackType } = useCreateTrackType();
    const { updateTrackType } = useUpdateTrackType();

    const handleCreateTrackType = (values: any) => {
        const variables: CreateVariables<CreateTrackTypePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createTrackType(variables);
    };

    const handleUpdateTrackType = (values: any) => {
        const variables: UpdateVariables<
            TrackTypeData['id'],
            UpdateTrackTypePayload
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

        updateTrackType(variables);
    };

    const onFinish = (values: any) => {
        active();
        return isUpdateForm
            ? handleUpdateTrackType(values)
            : handleCreateTrackType(values);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    function renderTitle() {
        return `${dataEdit?.id ? messages('common.update') : messages('common.create')} `;
    }

    const titleModal = renderTitle();

    return (
        <AppModal
            width={500}
            {...props}
            title={titleModal}
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
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
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
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
