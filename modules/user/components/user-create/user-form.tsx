import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import { validatePassword } from '@/helpers/validation';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import TenantSelect from '@/modules/tenant/components/tenant-select';
import TenantUserTypeSelect from '@/modules/tenant/components/tenant-user-type-select';
import { Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { checkIsTenantOwner } from '../../utils/role';
import UserTypeSelect from '../user-type-select';

type Props = {
    isCreate?: boolean;
} & AppFormProps;

function UserForm({ isCreate, ...props }: Props) {
    const messages = useTranslations();
    const { isSystemTenant, isNotSystemTenant } = useAuth();

    const tenantType = AppForm.useWatch('tenantType', props.form);

    return (
        <AppForm {...props}>
            <AppForm.Item
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
            </AppForm.Item>

            <AppForm.Item
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
            </AppForm.Item>

            {isSystemTenant && (
                <AppForm.Item
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
                </AppForm.Item>
            )}

            {isCreate && (
                <>
                    <AppForm.Item
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
                    </AppForm.Item>
                </>
            )}

            <AppForm.Item
                label={messages('user.telegramId')}
                rules={[
                    {
                        whitespace: true,
                    },
                ]}
                name="telegramId"
            >
                <Input placeholder={messages('user.telegramId')} />
            </AppForm.Item>

            <AppForm.Item
                label={messages('user.emailVerified')}
                name="emailVerified"
            >
                <Switch />
            </AppForm.Item>

            <AppForm.Item label={messages('status.label')} name="isActive">
                <Switch />
            </AppForm.Item>

            {isCreate && isSystemTenant && (
                <AppForm.Item
                    label={messages('tenant.label')}
                    name="tenantId"
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <TenantSelect flatData />
                </AppForm.Item>
            )}

            {((isCreate && isSystemTenant) || isNotSystemTenant) && (
                <AppForm.Item
                    label={messages('user.role.tenant.label')}
                    name={'tenantType'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <TenantUserTypeSelect
                        disabled={checkIsTenantOwner(tenantType)}
                    />
                </AppForm.Item>
            )}
        </AppForm>
    );
}

export default UserForm;
