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
                        <ImageListUpload maxCount={1} />
                    </AppFormItem>
                    <p className="flex-1 text-center text-sm text-gray-500">
                        Chúng tôi hỗ trợ định dạng ảnh PNG, JFIF, JPEG, or JPG
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
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
