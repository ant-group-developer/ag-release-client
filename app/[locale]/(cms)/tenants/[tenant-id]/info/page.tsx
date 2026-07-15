'use client';

import SubmitButton from '@/components/ui/button/submit-button';
import { useActive } from '@/hooks/use-active';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import TenantFormV2 from '@/modules/tenant/components/tenant-create/tenant-form-v2';
import { useTenantDetail } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenant } from '@/modules/tenant/hooks/use-update-tenant';
import { UpdateTenant, UpdateTenantPayload } from '@/modules/tenant/types/data';
import { getTenantOwnerId } from '@/modules/tenant/utils';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { Form } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {};

function DetailTenantPage({}: Props) {
    const { active, isActive, deActive } = useActive();
    // const { token } = theme.useToken();
    const { hasPermission } = usePermission();
    const canUpdateTenant = hasPermission(PERMISSION.WORKSPACE.UPDATE_INFO);

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

                let iconUrl: string = icon?.fileList[0]?.url;
                let logoUrl: string = logo?.fileList[0]?.url;

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
                    maxLabels: Number(otherValues.maxLabels),
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
                ownerId: getTenantOwnerId(dataTenant.tenantUser),
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
        <div
            style={
                {
                    // backgroundColor: token?.colorBgContainer,
                }
            }
            // className="rounded-lg p-4"
        >
            <TenantFormV2
                layout="horizontal"
                form={form}
                submitProps={{ loading: isActive }}
                excludeIds={[tenantId]}
                showSubmit={false}
                tenantId={tenantId}
                labelCol={{
                    xs: 9,
                    md: 8,
                    lg: 7,
                    xxl: 4,
                }}
                wrapperCol={{
                    xs: 15,
                    md: 16,
                    lg: 17,
                    xxl: 20,
                }}
                disabled={!canUpdateTenant}
            />
            <PermissionGate permission={PERMISSION.WORKSPACE.UPDATE_INFO}>
                <div className="mt-2 text-right">
                    <SubmitButton onClick={onFinish} loading={isActive} />
                </div>
            </PermissionGate>
        </div>
    );
}

export default DetailTenantPage;
