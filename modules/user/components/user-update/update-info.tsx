import { Form } from 'antd';
import { useEffect } from 'react';
import { useUserDetail } from '../../hooks/use-get-user';
import { useUpdateUser } from '../../hooks/use-update-user';
import { UpdateUser, UpdateUserPayload, UserData } from '../../types/data';
import UserForm from '../user-create/user-form';

type Props = {
    dataEdit: UserData;
};

function UpdateInfo({ dataEdit }: Props) {
    const [form] = Form.useForm();

    const userId = dataEdit.id as string;

    const { dataUser } = useUserDetail(userId);

    const { updateUser, isPending } = useUpdateUser();

    async function onFinish(values: any) {
        const payload: UpdateUserPayload = {
            ...values,
        };

        const updateVariables: UpdateUser = {
            userId,
            payload,
        };

        return updateUser(updateVariables);
    }

    useEffect(() => {
        if (dataUser) {
            const initialValues = {
                ...dataUser,
            };

            form.setFieldsValue(initialValues);
        }
    }, [dataUser, form]);

    return (
        <UserForm
            onFinish={onFinish}
            form={form}
            submitProps={{ loading: isPending }}
        />
    );
}

export default UpdateInfo;
