import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {};

export default function CreateLabelModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    return (
        <AppModal
            width={600}
            {...props}
            title={`${messages('common.create')} label`}
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
