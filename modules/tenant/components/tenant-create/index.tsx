import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import { useApiError } from '@/hooks/use-api-error';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { checkIsSystemTenant } from '@/modules/user/utils/role';
import { Button, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_TYPE } from '../../enums';
import { useCreateTenant } from '../../hooks/use-create-tenant';
import { CreateTenant, CreateTenantPayload } from '../../types/data';
import TenantForm from './tenant-form';

type Props = {} & Omit<AppModalProps, 'children'>;

function CreateTenantModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const { handleError } = useApiError();

    const {
        profile: { tenantId },
    } = useAuth();

    const { createTenant } = useCreateTenant();

    function onFinish() {
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

                const payload: CreateTenantPayload = {
                    ...otherValues,
                    maxLabels: Number(otherValues.maxLabels),
                    icon: iconUrl,
                    logo: logoUrl,
                    primaryColor: hexString,
                };

                const createVariables: CreateTenant = {
                    payload,
                    onSuccess,
                    onError: deActive,
                };

                createTenant(createVariables);
            })
            .catch((err) => {
                console.log('err:', err);
                handleError(err);
                deActive();
            });
    }

    function onSuccess() {
        form.resetFields();
        deActive();
    }

    return (
        <AppModal
            {...props}
            title={messages('action.create.button')}
            footer={null}
            width={1000}
            loading={isActive}
            className="!top-5"
        >
            <TenantForm
                disabled={isActive}
                initialValues={{
                    emailVerified: true,
                    isActive: true,
                    type: TENANT_TYPE.LABEL,
                    maxLabels: 1,
                    parentId: checkIsSystemTenant(tenantId)
                        ? undefined
                        : tenantId,
                }}
                form={form}
                showSubmit={false}
            />
            <div className="text-right">
                <Button type="primary" onClick={onFinish} loading={isActive}>
                    {messages('common.submit')}
                </Button>
            </div>
        </AppModal>
    );
}

export default CreateTenantModal;
