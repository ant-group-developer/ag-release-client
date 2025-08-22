'use client';

import AppContainer from '@/components/ant-music/app-container';
import SubmitButton from '@/components/ui/button/submit-button';
import { useActive } from '@/hooks/use-active';
import TenantForm from '@/modules/tenant/components/tenant-create/tenant-form';
import { useTenantDetail } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenant } from '@/modules/tenant/hooks/use-update-tenant';
import { UpdateTenant, UpdateTenantPayload } from '@/modules/tenant/types/data';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { Form } from 'antd';
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
                            entityType: ENTITY_TYPE_PICTURE.TENANT,
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
                            entityType: ENTITY_TYPE_PICTURE.TENANT,
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
                    onSuccess: deActive,
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
                parentId: dataTenant.parent?.id,
                logo: dataTenant?.logo
                    ? {
                          fileList: [
                              {
                                  uid: dataTenant?.id,
                                  thumbUrl: dataTenant?.logo,
                                  url: dataTenant?.logo,
                                  name: dataTenant?.name,
                              },
                          ],
                      }
                    : undefined,
                icon: dataTenant?.icon
                    ? {
                          fileList: [
                              {
                                  uid: dataTenant?.id,
                                  thumbUrl: dataTenant?.icon,
                                  url: dataTenant?.icon,
                                  name: dataTenant?.name,
                              },
                          ],
                      }
                    : undefined,
            };

            form.setFieldsValue(initialValues);
        }
    }, [dataTenant, form]);

    return (
        <AppContainer>
            <div className="max-w-screen-xl">
                <TenantForm
                    layout="vertical"
                    className="grid grid-cols-1 gap-5 lg:grid-cols-2"
                    form={form}
                    submitProps={{ loading: isActive }}
                    excludeIds={[tenantId]}
                    showSubmit={false}
                    canChangeParent
                />
                <div className="text-right">
                    <SubmitButton onClick={onFinish} loading={isActive} />
                </div>
            </div>
        </AppContainer>
    );
}

export default DetailTenantPage;
