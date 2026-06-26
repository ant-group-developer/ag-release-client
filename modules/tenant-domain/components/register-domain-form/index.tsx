'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import SubmitButton from '@/components/ui/button/submit-button';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useRegisterTenantDomain } from '../../hooks/use-register-tenant-domain';
import { RegisterDomainPayload } from '../../types/payload';

interface Props {
    tenantId: string;
}

function RegisterDomainForm({ tenantId }: Props) {
    const t = useTranslations('tenantDomain');
    const [form] = Form.useForm<RegisterDomainPayload>();
    const { mutate, isPending } = useRegisterTenantDomain(tenantId);

    function onFinish(values: RegisterDomainPayload) {
        mutate(values);
    }

    return (
        <AppForm form={form} onFinish={onFinish} layout="vertical">
            <AppFormItem
                name="domain"
                label={t('field.domain')}
                rules={[
                    { required: true, message: t('validation.domainRequired') },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const isValid = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value);
                            return isValid
                                ? Promise.resolve()
                                : Promise.reject(t('validation.domainInvalid'));
                        },
                    },
                ]}
            >
                <Input placeholder="release.yourdomain.com" />
            </AppFormItem>

            <SubmitButton loading={isPending} />
        </AppForm>
    );
}

export default RegisterDomainForm;
