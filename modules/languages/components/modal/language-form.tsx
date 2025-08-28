import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateLanguage } from '../../hooks/use-create-language';
import { useUpdateLanguage } from '../../hooks/use-update-language';
import { LanguagesData } from '../../types';
import {
    CreateLanguagePayload,
    UpdateLanguagePayload,
} from '../../types/payload';

type LanguageFormValues = Omit<LanguagesData, 'id' | 'createdAt' | 'updatedAt'>;

type Props = Omit<AppModalProps, 'children'> & {};

export default function LanguageFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<LanguageFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as LanguagesData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();

    const { createLanguage, isPending: isCreatePending } = useCreateLanguage();
    const { updateLanguage, isPending: isUpdatePending } = useUpdateLanguage();

    const handleCreateLanguage = (values: LanguageFormValues) => {
        const variables: CreateVariables<CreateLanguagePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createLanguage(variables);
    };

    const handleUpdateLanguage = (values: LanguageFormValues) => {
        const variables: UpdateVariables<
            LanguagesData['id'],
            UpdateLanguagePayload
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
        updateLanguage(variables);
    };

    const onfinish = (values: LanguageFormValues) => {
        active();
        try {
            return isUpdateForm
                ? handleUpdateLanguage(values)
                : handleCreateLanguage(values);
        } catch (error) {
            deActive();
        }
    };

    const modalTitle = () => {
        return `${isUpdateForm ? messages('common.update') : messages('common.create')} ${messages('language.label').toLocaleLowerCase()}`;
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
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onfinish}
                layout="vertical"
                disabled={isActive}
            >
                <AppFormItem
                    name="name"
                    label={messages('language.name')}
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
                                field: messages('language.name'),
                            }),
                        },
                    ]}
                >
                    <Input placeholder={messages('language.name')} allowClear />
                </AppFormItem>
                <AppFormItem
                    name="code"
                    label={messages('language.code')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 10,
                            message: messages('validation.max', {
                                number: 10,
                            }),
                        },
                    ]}
                >
                    <Input
                        placeholder={`${messages('language.code')} (en, vi, ja...)`}
                        allowClear
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
