import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTrackOriginType } from '../../hooks/use-create-track-origin-type';
import { useUpdateTrackOriginType } from '../../hooks/use-update-track-origin-type';
import { TrackOriginTypeData } from '../../types';
import {
    CreateTrackOriginTypePayload,
    UpdateTrackOriginTypePayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TrackOriginTypeFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as TrackOriginTypeData
    );
    console.log('🚀 ~ TrackOriginTypeFormModal ~ dataEdit:', dataEdit);
    const isUpdateForm = dataEdit?.id;

    const { createTrackOriginType } = useCreateTrackOriginType();
    const { updateTrackOriginType } = useUpdateTrackOriginType();

    const handleCreateTrackOriginType = (values: any) => {
        const variables: CreateVariables<CreateTrackOriginTypePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createTrackOriginType(variables);
    };

    const handleUpdateTrackOriginType = (values: any) => {
        const variables: UpdateVariables<
            TrackOriginTypeData['id'],
            UpdateTrackOriginTypePayload
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

        updateTrackOriginType(variables);
    };

    const onFinish = (values: any) => {
        active();
        return isUpdateForm
            ? handleUpdateTrackOriginType(values)
            : handleCreateTrackOriginType(values);
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
                    label={messages('trackOrigin.label')}
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
                <AppFormItem
                    name="value"
                    label={messages('trackOrigin.value')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 50,
                            message: messages('validation.max', {
                                number: 50,
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
