import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useUserDetail } from '../../hooks/use-get-user';
import { useUpdateUser } from '../../hooks/use-update-user';
import { UpdateUser, UpdateUserPayload, UserData } from '../../types/data';
import { getTenantUserType } from '../../utils/role';
import UserForm from '../user-create/user-form';

type Props = {
    dataEdit: UserData;
};

function UpdateInfo({ dataEdit }: Props) {
    const [form] = Form.useForm();

    const userId = dataEdit.id as string;

    const { dataUser } = useUserDetail(userId);
    const {
        profile: { tenantId },
    } = useAuth();

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
                tenantType: getTenantUserType(dataUser.tenantUser, tenantId),
            };

            form.setFieldsValue(initialValues);
        }
    }, [dataUser, form, tenantId]);

    return (
        <UserForm
            onFinish={onFinish}
            form={form}
            submitProps={{ loading: isPending }}
        />
    );
}

export default UpdateInfo;
