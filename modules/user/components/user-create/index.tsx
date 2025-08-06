import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { USER_TYPE } from '../../enums';
import { useCreateUser } from '../../hooks/use-create-user';
import { CreateUser, CreateUserPayload } from '../../types/data';
import UserForm from './user-form';

type Props = {} & Omit<AppModalProps, 'children'>;

function CreateUserModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();

    const { createUser, isPending } = useCreateUser();

    async function onFinish(values: any) {
        const payload: CreateUserPayload = {
            ...values,
        };

        const createVariables: CreateUser = {
            payload,
            onSuccess,
        };

        return createUser(createVariables);
    }

    function onSuccess() {
        form.resetFields();
    }

    return (
        <AppModal
            {...props}
            title={messages('action.create.button')}
            footer={null}
            width={800}
            loading={isPending}
            className="top-10"
        >
            <UserForm
                disabled={isPending}
                initialValues={{
                    emailVerified: true,
                    isActive: true,
                    type: USER_TYPE.USER,
                }}
                onFinish={onFinish}
                form={form}
                submitProps={{ loading: isPending }}
                isCreate
            />
        </AppModal>
    );
}

export default CreateUserModal;
