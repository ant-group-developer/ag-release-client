import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { validatePassword } from '@/helpers/validation';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useUpdateUser } from '../../hooks/use-update-user';
import { UpdateUser, UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

function UpdatePassword({ dataEdit }: Props) {
    const userId = dataEdit.id;

    const messages = useTranslations();
    const [form] = Form.useForm();

    const { updateUser, isPending } = useUpdateUser();

    async function onFinish(values: any) {
        const updateVariables: UpdateUser = {
            userId,
            payload: values,
            onSuccess: () => form.resetFields(),
        };

        updateUser(updateVariables);
    }

    return (
        <AppForm
            form={form}
            onFinish={onFinish}
            submitProps={{ loading: isPending }}
        >
            <AppFormItem
                label={messages('user.password')}
                required
                rules={[
                    {
                        required: true,
                        min: 8,
                        whitespace: true,
                        max: 50,
                    },
                    {
                        validator: (rule, value, callback) =>
                            validatePassword(
                                rule,
                                value,
                                callback,
                                messages('validation.passwordFormat')
                            ),
                    },
                ]}
                name="password"
            >
                <Input.Password placeholder={messages('user.password')} />
            </AppFormItem>
        </AppForm>
    );
}

export default UpdatePassword;
