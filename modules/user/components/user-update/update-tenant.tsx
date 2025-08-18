import AppForm from '@/components/ui/antd-form/form';
import TenantSelect from '@/modules/tenant/components/tenant-select';
import TenantUserTypeSelect from '@/modules/tenant/components/tenant-user-type-select';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

function UpdateTenant({}: Props) {
    const messages = useTranslations();

    return (
        <AppForm layout="vertical">
            <AppForm.List name="tenants" initialValue={[]}>
                {(fields, { add, remove }) => (
                    <div className="mb-2">
                        {fields.map((field) => (
                            <div
                                className="grid grid-cols-2 gap-4"
                                key={field.key}
                            >
                                <AppForm.Item
                                    name={[field.name, 'tenantId']}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TenantSelect />
                                </AppForm.Item>
                                <AppForm.Item
                                    name={[field.name, 'tenantUserType']}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TenantUserTypeSelect />
                                </AppForm.Item>
                            </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                            + {messages('tenant.label')}
                        </Button>
                    </div>
                )}
            </AppForm.List>
        </AppForm>
    );
}

export default UpdateTenant;
