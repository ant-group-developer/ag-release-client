import { Form } from 'antd';
import { useEffect } from 'react';
import { useTenantDetail } from '../../hooks/use-get-tenant';
import { useUpdateTenant } from '../../hooks/use-update-tenant';
import {
    TenantData,
    UpdateTenant,
    UpdateTenantPayload,
} from '../../types/data';
import TenantForm from '../tenant-create/tenant-form';

type Props = {
    dataEdit: TenantData;
};

function UpdateInfo({ dataEdit }: Props) {
    const [form] = Form.useForm();

    const tenantId = dataEdit.id as string;

    const { dataTenant } = useTenantDetail(tenantId);

    const { updateTenant, isPending } = useUpdateTenant();

    async function onFinish(values: any) {
        const payload: UpdateTenantPayload = {
            ...values,
        };

        const updateVariables: UpdateTenant = {
            tenantId,
            payload,
        };

        return updateTenant(updateVariables);
    }

    useEffect(() => {
        if (dataTenant) {
            const initialValues = {
                ...dataTenant,
            };

            form.setFieldsValue(initialValues);
        }
    }, [dataTenant, form]);

    return (
        <TenantForm
            onFinish={onFinish}
            form={form}
            submitProps={{ loading: isPending }}
        />
    );
}

export default UpdateInfo;
