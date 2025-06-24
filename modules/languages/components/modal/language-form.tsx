import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { LanguagesData } from '../../types';

type Props = Omit<AppModalProps, 'children'> & {};

export default function LanguageFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as LanguagesData);

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
            title={messages('common.create') + ' ' + messages('language.label')}
            open
            onCancel={closeModal}
            onOk={form.submit}
        >
            <AppForm form={form} showSubmit={false} layout="vertical">
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
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
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
                            message: messages('common.error'),
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
