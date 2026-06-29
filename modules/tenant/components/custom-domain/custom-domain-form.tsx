import SubmitButton from '@/components/ui/button/submit-button';
import { CreateTenantDomainPayload } from '@/modules/tenant/types/data';
import { Form, Input, theme } from 'antd';
import { useTranslations } from 'next-intl';

interface CustomDomainFormProps {
    isAdmin: boolean;
    isPending: boolean;
    onSubmit: (payload: CreateTenantDomainPayload) => Promise<void>;
}

export default function CustomDomainForm({
    isAdmin,
    isPending,
    onSubmit,
}: CustomDomainFormProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [form] = Form.useForm<CreateTenantDomainPayload>();

    const handleFinish = async (payload: CreateTenantDomainPayload) => {
        await onSubmit(payload);
        form.resetFields();
    };

    return (
        <div
            className="rounded-lg p-4"
            style={{ background: token.colorBgContainer }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                disabled={!isAdmin || isPending}
            >
                <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: token.colorText }}
                >
                    {messages('tenant.customDomain.label')}
                </label>
                <div className="flex items-start gap-2">
                    <Form.Item
                        className="mb-0 !w-full flex-1"
                        name="domain"
                        rules={[
                            {
                                required: true,
                                message: messages(
                                    'tenant.customDomain.validation.required'
                                ),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages(
                                'tenant.customDomain.placeholder'
                            )}
                            allowClear
                        />
                    </Form.Item>

                    <SubmitButton
                        htmlType="submit"
                        loading={isPending}
                    />
                </div>
            </Form>
        </div>
    );
}
