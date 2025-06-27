import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { GenresData } from '../../types';

// Modal tạo/sửa thể loại nhạc

type Props = Omit<AppModalProps, 'children'> & {};

export default function GenresFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as GenresData);

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    function renderTitle() {
        const isUpdate = !!dataEdit?.id;
        return `${isUpdate ? messages('common.update') : messages('common.create')} Thể loại nhạc`;
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
            className="!top-4"
        >
            <AppForm form={form} showSubmit={false} layout="vertical">
                <div className="flex items-center gap-4">
                    <AppFormItem
                        name="picture"
                        label={'Ảnh'}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: 255,
                                message: messages('validation.max', {
                                    number: 255,
                                }),
                            },
                        ]}
                    >
                        <ImageListUpload maxCount={1} accept="image/*" />
                    </AppFormItem>
                    <p className="flex-1 text-center text-sm text-gray-500">
                        Hỗ trợ định dạng ảnh PNG, JFIF, JPEG, JPG
                    </p>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('formFields.genres') || 'Tên thể loại'}
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
                        placeholder={
                            messages('formFields.genres') || 'Tên thể loại'
                        }
                        allowClear
                    />
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('common.description') || 'Mô tả'}
                    rules={[
                        {
                            max: 300,
                            message: messages('validation.max', {
                                number: 300,
                            }),
                        },
                    ]}
                >
                    <Input.TextArea
                        placeholder={messages('common.description') || 'Mô tả'}
                        allowClear
                        rows={3}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
