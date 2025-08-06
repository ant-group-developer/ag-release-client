import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { validatePassword } from '@/helpers/validation';
import { Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import UserTypeSelect from '../user-type-select';

type Props = {
    isCreate?: boolean;
} & AppFormProps;

function UserForm({ isCreate, ...props }: Props) {
    const messages = useTranslations();
    return (
        <AppForm {...props}>
            <AppFormItem
                label={messages('user.name')}
                required
                rules={[
                    {
                        whitespace: true,
                        required: true,
                    },
                ]}
                name="name"
            >
                <Input placeholder={messages('user.name')} />
            </AppFormItem>

            <AppFormItem
                label={messages('common.email')}
                required
                rules={[
                    {
                        whitespace: true,
                        required: true,
                        type: 'email',
                    },
                ]}
                name="email"
            >
                <Input placeholder={messages('common.email')} />
            </AppFormItem>

            <AppFormItem
                label={messages('user.type')}
                name="type"
                required
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <UserTypeSelect />
            </AppFormItem>

            {isCreate && (
                <>
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
                        <Input.Password
                            placeholder={messages('user.password')}
                        />
                    </AppFormItem>
                </>
            )}

            <AppFormItem
                label={messages('user.telegramId')}
                rules={[
                    {
                        whitespace: true,
                    },
                ]}
                name="telegramId"
            >
                <Input placeholder={messages('user.telegramId')} />
            </AppFormItem>

            <AppFormItem
                label={messages('user.emailVerified')}
                name="emailVerified"
            >
                <Switch />
            </AppFormItem>

            <AppFormItem label={messages('status.label')} name="isActive">
                <Switch />
            </AppFormItem>
        </AppForm>
    );
}

export default UserForm;
