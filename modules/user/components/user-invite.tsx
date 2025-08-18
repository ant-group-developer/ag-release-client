import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import TenantUserTypeSelect from '@/modules/tenant/components/tenant-user-type-select';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useInviteUser } from '../hooks/use-invite-user';
import { InviteUser, InviteUserPayload } from '../types/data';

type Props = {} & Omit<AppModalProps, 'children'>;

function InviteUserModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);

    const { inviteUser, isPending } = useInviteUser();

    async function onFinish(values: any) {
        const payload: InviteUserPayload = {
            ...values,
        };

        const inviteVariables: InviteUser = {
            payload,
            onSuccess: closeModal,
        };

        return inviteUser(inviteVariables);
    }

    return (
        <AppModal
            {...props}
            title={messages('action.invite.title', {
                label: messages('user.label'),
            })}
            footer={null}
            loading={isPending}
            className="top-10"
        >
            <AppForm
                layout="vertical"
                onFinish={onFinish}
                disabled={isPending}
                submitProps={{ loading: isPending }}
            >
                <AppForm.Item
                    label={messages('user.email')}
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: messages('validation.emailFormat'),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('user.email'),
                                max: 50,
                            }),
                        },
                        {
                            min: 3,
                            message: messages('validation.stringMin', {
                                field: messages('user.email'),
                                min: 3,
                            }),
                        },
                    ]}
                >
                    <Input showCount />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('user.role.tenant.label')}
                    name={'type'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <TenantUserTypeSelect />
                </AppForm.Item>
            </AppForm>
        </AppModal>
    );
}

export default InviteUserModal;
