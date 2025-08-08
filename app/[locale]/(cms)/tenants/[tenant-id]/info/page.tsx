'use client';

import AppContainer from '@/components/ant-music/app-container';
import TenantForm from '@/modules/tenant/components/tenant-create/tenant-form';
import { useTenantDetail } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenant } from '@/modules/tenant/hooks/use-update-tenant';
import { UpdateTenant, UpdateTenantPayload } from '@/modules/tenant/types/data';
import { Button, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {};

function DetailTenantPage({}: Props) {
    const messages = useTranslations();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const [form] = Form.useForm();

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
        <AppContainer>
            <div className="">
                <TenantForm
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                    onFinish={onFinish}
                    form={form}
                    submitProps={{ loading: isPending }}
                    excludeIds={[tenantId]}
                    showSubmit={false}
                />
                <div className="text-right">
                    <Button type="primary">{messages('common.submit')}</Button>
                </div>
            </div>
        </AppContainer>
    );
}

export default DetailTenantPage;
