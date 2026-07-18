import AppForm from '@/components/ui/antd-form/form';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { flattenData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import TenantTreeSelect from '@/modules/tenant/components/tenant-tree-select';
import TenantUserTypeSelect from '@/modules/tenant/components/tenant-user-type-select';
import { TENANT_ORDER_BY, TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import { DeleteOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import uniqBy from 'lodash/uniqBy';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUserDetail } from '../../hooks/use-get-user';
import { useBulkUpdateTenantUser } from '../../hooks/use-update-user';
import { UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

type FormValues = {
    tenants: {
        tenantId: string;
        tenantUserType: TENANT_USER_TYPE;
    }[];
};

function UpdateTenant({ dataEdit }: Props) {
    const messages = useTranslations();
    const { data: dataTenant } = useTenantList({
        fieldOrder: TENANT_ORDER_BY.EMAIL,
        orderBy: ORDER.ASC,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const { bulkUpdateTenantUser } = useBulkUpdateTenantUser();

    const [form] = AppForm.useForm();
    const userId = dataEdit.id;
    const { dataUser } = useUserDetail(userId);

    useEffect(() => {
        if (!dataUser) return;
        const initialValue =
            dataUser.tenantUser?.map((item) => ({
                tenantId: item.tenant.id,
                tenantUserType: item.type,
                // mark as locked if OWNER (cannot edit these rows)
                __locked: item.type === TENANT_USER_TYPE.OWNER,
            })) ?? [];

        form.setFieldValue('tenants', initialValue);
    }, [dataUser, form]);

    // watch list values so we can check per-row lock state
    const tenants = AppForm.useWatch('tenants', form) ?? [];

    const onFinish = ({ tenants }: FormValues) => {
        const data = uniqBy(tenants, 'tenantId');
        if (data.length !== tenants.length) {
            return showNotification(
                'error',
                messages('user.update.tenant.conflictError')
            );
        }

        bulkUpdateTenantUser({
            payload: {
                userId,
                // @ts-ignore
                data: tenants
                    .filter(
                        (item) => item.tenantUserType !== TENANT_USER_TYPE.OWNER
                    )
                    .map((item) => ({
                        tenantId: item.tenantId,
                        type: item.tenantUserType,
                    })),
            },
        });
    };

    return (
        <div className="space-y-3">
            <Alert
                type="warning"
                showIcon
                message={
                    <p
                        dangerouslySetInnerHTML={{
                            __html: messages.markup(
                                'user.update.tenant.changeOwnerHint',
                                {
                                    element: (chunks) =>
                                        `<b class="font-semibold">${chunks}</b>`,
                                }
                            ),
                        }}
                    />
                }
            />
            <AppForm layout="vertical" form={form} onFinish={onFinish}>
                <AppForm.List name="tenants" initialValue={[]}>
                    {(fields, { add, remove }) => (
                        <div className="mb-2">
                            {fields.map((field) => {
                                const isLocked =
                                    tenants?.[field.name]?.__locked === true;

                                return (
                                    <div className="flex gap-4" key={field.key}>
                                        {/* keep __locked in the store but don't render */}
                                        <AppForm.Item
                                            name={[field.name, '__locked']}
                                            hidden
                                        />

                                        <div className="flex-1">
                                            <AppForm.Item
                                                name={[field.name, 'tenantId']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            messages(
                                                                'validation.select'
                                                            ),
                                                    },
                                                ]}
                                            >
                                                <TenantTreeSelect
                                                    disabled={isLocked}
                                                />
                                            </AppForm.Item>
                                        </div>

                                        <div className="flex-1">
                                            <AppForm.Item
                                                name={[
                                                    field.name,
                                                    'tenantUserType',
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            messages(
                                                                'validation.select'
                                                            ),
                                                    },
                                                ]}
                                            >
                                                <TenantUserTypeSelect
                                                    disabled={isLocked}
                                                />
                                            </AppForm.Item>
                                        </div>

                                        <Button
                                            disabled={isLocked}
                                            danger
                                            onClick={() => remove(field.name)}
                                            icon={<DeleteOutlined />}
                                        />
                                    </div>
                                );
                            })}
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                disabled={
                                    flattenData(dataTenant.items, {}).length <=
                                    tenants.length
                                }
                            >
                                + {messages('tenant.label')}
                            </Button>
                        </div>
                    )}
                </AppForm.List>
            </AppForm>
        </div>
    );
}

export default UpdateTenant;
