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
import { useCreateArtistRole } from '../../hooks/use-create-artist-role';
import { useUpdateArtistRole } from '../../hooks/use-update-artist-role';
import { ArtistRoleData } from '../../types';
import {
    CreateArtistRolePayload,
    UpdateArtistRolePayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function ArtistRoleFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ArtistRoleData);
    const isUpdateForm = dataEdit?.id;

    const { createArtistRole, isPending: isCreateArtistRole } =
        useCreateArtistRole();
    const { updateArtistRole, isPending: isUpdateArtistRole } =
        useUpdateArtistRole();

    const handleCreateArtistRole = (values: any) => {
        const variables: CreateVariables<CreateArtistRolePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
            },
        };
        createArtistRole(variables);
    };

    const handleUpdateArtistRole = (values: any) => {
        const variables: UpdateVariables<
            ArtistRoleData['id'],
            UpdateArtistRolePayload
        > = {
            id: dataEdit?.id,
            payload: values,
        };

        updateArtistRole(variables);
    };

    const onFinish = (values: any) => {
        return isUpdateForm
            ? handleUpdateArtistRole(values)
            : handleCreateArtistRole(values);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    function renderTitle() {
        return dataEdit?.id ? messages('role.update') : messages('role.add');
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
            loading={isCreateArtistRole || isUpdateArtistRole}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
            >
                <AppFormItem
                    name="name"
                    label={messages('role.name')}
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
                        placeholder={messages('role.name')}
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
                    <Input placeholder={messages('common.code')} allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
