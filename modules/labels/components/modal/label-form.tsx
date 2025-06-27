import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_LABEL } from '../../enum';

type Props = Omit<AppModalProps, 'children'> & {};

export default function LabelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const isUpdateModal = typeModal === TYPE_MODAL_LABEL.EDIT;
    const isCreateModal = typeModal === TYPE_MODAL_LABEL.CREATE;
    return (
        <AppModal
            width={600}
            {...props}
            title={`${isCreateModal ? messages('common.create') : messages('common.update')} label`}
            open
            onCancel={closeModal}
            onOk={form.submit}
        >
            <AppForm form={form} showSubmit={false} layout="vertical">
                <div className="flex items-center gap-4">
                    <AppFormItem name="thumbnail" label={'Logo'}>
                        <ImageListUpload maxCount={1} accept="image/*" />
                    </AppFormItem>
                    <p className="flex-1 text-center text-sm text-gray-500">
                        Hỗ trợ định dạng ảnh PNG, JFIF, JPEG, or JPG
                    </p>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('releases.labelName')}
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
                    name="description"
                    label={messages('common.description')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
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
