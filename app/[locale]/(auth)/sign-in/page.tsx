'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { APP_ROUTES } from '@/enums/routes';
import { validatePassword } from '@/helpers/validation';
import { useApiError } from '@/hooks/use-api-error';
import { Button, Input, theme } from 'antd';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface FormValues {
    email: string;
    password: string;
}

export default function SignInPage() {
    const { token } = theme.useToken();
    const [isLoading, setIsLoading] = useState(false);
    const messages = useTranslations();
    const { handleError } = useApiError();

    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            toast(decodeURIComponent(error), {
                type: 'error',
            });
        }
    }, [error]);

    const onFinish = async (values: FormValues) => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: true,
                callbackUrl: `${APP_ROUTES.DASHBOARD}`,
            });

            if (result?.error) {
                handleError(result.error);
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8 space-y-2 text-center">
                <h1
                    className="text-center text-2xl font-semibold"
                    style={{
                        color: token.colorText,
                    }}
                >
                    {messages('auth.signIn.title')}
                </h1>
                <p
                    className="text-sm text-gray-400"
                    style={{
                        color: token.colorTextTertiary,
                    }}
                >
                    {messages('auth.signIn.description')}
                </p>
            </div>

            <AppForm
                size="large"
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
                showSubmit={false}
            >
                <AppFormItem
                    required
                    label={messages('common.email')}
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'email',
                            message: messages('validation.emailFormat'),
                        },
                        {
                            min: 5,
                            message: messages('validation.stringMin', {
                                field: messages('common.email'),
                                min: 5,
                            }),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('common.email'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    required
                    label={messages('user.password')}
                    name={'password'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            min: 5,
                            message: messages('validation.stringMin', {
                                field: messages('user.password'),
                                min: 5,
                            }),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('user.password'),
                                max: 50,
                            }),
                        },
                        {
                            validator: (rule, value, callback) =>
                                validatePassword(
                                    rule,
                                    value,
                                    callback,
                                    messages('validation.passwordFormat')
                                ),
                        },
                    ]}
                >
                    <Input.Password />
                </AppFormItem>
                <Button
                    className="mt-4"
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                >
                    {messages('auth.signIn.submit')}
                </Button>
            </AppForm>
        </div>
    );
}
