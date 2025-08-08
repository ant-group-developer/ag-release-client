'use client';

import AppContainer from '@/components/ant-music/app-container';
import { useActive } from '@/hooks/use-active';
import TenantForm from '@/modules/tenant/components/tenant-create/tenant-form';
import { useTenantDetail } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenant } from '@/modules/tenant/hooks/use-update-tenant';
import { UpdateTenant, UpdateTenantPayload } from '@/modules/tenant/types/data';
import { uploadApi } from '@/modules/upload/apis';
import { Button, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {};

function DetailTenantPage({}: Props) {
    const messages = useTranslations();
    const { active, isActive, deActive } = useActive();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const [form] = Form.useForm();

    const { dataTenant } = useTenantDetail(tenantId);

    const { updateTenant } = useUpdateTenant();

    async function onFinish() {
        form.validateFields()
            .then(async (values) => {
                active();

                const { icon, logo, primaryColor, ...otherValues } = values;
                const iconFile = icon?.fileList[0]?.originFileObj;
                const logoFile = logo?.fileList[0]?.originFileObj;

                let iconUrl: string | undefined = undefined;
                let logoUrl: string | undefined = undefined;

                if (iconFile) {
                    iconUrl = await uploadApi.uploadFile({
                        infoFile: {
                            entityType: 'tenants',
                            fileName: iconFile.name,
                            contentType: iconFile.type,
                            fileSize: iconFile.size,
                        },
                        file: iconFile,
                    });
                }

                if (logoFile) {
                    logoUrl = await uploadApi.uploadFile({
                        infoFile: {
                            entityType: 'tenants',
                            fileName: logoFile.name,
                            contentType: logoFile.type,
                            fileSize: logoFile.size,
                        },
                        file: logoFile,
                    });
                }

                const hexString =
                    typeof primaryColor === 'string'
                        ? primaryColor
                        : primaryColor?.toHexString();

                const payload: UpdateTenantPayload = {
                    ...otherValues,
                    icon: iconUrl,
                    logo: logoUrl,
                    primaryColor: hexString,
                };

                const updateVariables: UpdateTenant = {
                    tenantId,
                    payload,
                    onError: deActive,
                };

                return updateTenant(updateVariables);
            })
            .catch((error) => {
                console.log('error:', error);
                deActive();
            });
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
                    form={form}
                    submitProps={{ loading: isActive }}
                    excludeIds={[tenantId]}
                    showSubmit={false}
                />
                <div className="text-right">
                    <Button
                        onClick={onFinish}
                        type="primary"
                        loading={isActive}
                    >
                        {messages('common.submit')}
                    </Button>
                </div>
            </div>
        </AppContainer>
    );
}

export default DetailTenantPage;
