'use client';

import AppForm from '@/components/ui/antd-form/form';
import { LOCALHOST } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { validatePassword } from '@/helpers/validation';
import { useApiNotify } from '@/hooks/use-api-notify';
import { Link } from '@/i18n/routing';
import { authApi } from '@/modules/auth/api';
import { useCheckPermission } from '@/modules/auth/hooks/use-permission';
import { useCurrentDomain } from '@/modules/tenant/hooks/use-current-domain';
import { Alert, Button, Input, theme } from 'antd';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface FormValues {
    email: string;
    password: string;
}

export default function SignInPage() {
    const { token } = theme.useToken();
    const currentDomain = useCurrentDomain();
    const locale = useLocale();
    const { getFirstAccessibleRoute } = useCheckPermission();
    // const { domainData } = useResolveDomain(currentDomain);

    const [isLoading, setIsLoading] = useState(false);
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorMessage = decodeURIComponent(error ?? '');

    // useEffect(() => {
    //     if (error) {
    //         toast(decodeURIComponent(error), {
    //             type: 'error',
    //             autoClose: false,
    //         });
    //     }
    // }, [error]);

    const onFinish = async (values: FormValues) => {
        setIsLoading(true);

        const defaultCallbackUrl = `${window.location.origin}/${locale}${APP_ROUTES.DASHBOARD}`;
        try {
            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
                callbackUrl: defaultCallbackUrl,
                ...(currentDomain && currentDomain !== LOCALHOST
                    ? { currentDomain }
                    : {}),
            });

            if (result?.error) {
                // handleError(result.error);
                const newUrl = `${window.location.pathname}?error=${encodeURIComponent(result.error)}`;
                window.history.replaceState(null, '', newUrl);
            } else if (result?.ok) {
                window.history.replaceState(null, '', window.location.pathname);
                const fallbackUrl =
                    result?.url && !result.url.includes(APP_ROUTES.SIGN_IN)
                        ? result.url
                        : defaultCallbackUrl;

                try {
                    const infoRes = await authApi.getInfo();
                    const targetRoute = getFirstAccessibleRoute(
                        infoRes.data?.data
                    );
                    window.location.href = `${window.location.origin}/${locale}${targetRoute}`;
                } catch {
                    window.location.href = fallbackUrl;
                }
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

            {errorMessage && (
                <Alert
                    message={messages(errorMessage as any)}
                    type="error"
                    showIcon
                />
            )}

            <AppForm
                size="large"
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
                showSubmit={false}
            >
                <AppForm.Item
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
                </AppForm.Item>
                <AppForm.Item
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
                    extra={
                        <p className="mt-2 text-right">
                            <Link href={APP_ROUTES.FORGOT_PASSWORD}>
                                {messages('auth.forgotPassword.title')}
                            </Link>
                        </p>
                    }
                >
                    <Input.Password />
                </AppForm.Item>
                <Button
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
