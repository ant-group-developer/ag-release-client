import { APP_ROUTES } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAuth } from '../hooks/use-auth';

type Props = {
    className?: string;
};

function Forbidden({ className }: Props) {
    const messages = useTranslations();
    const { logout } = useAuth();
    return (
        <div
            className={cn(
                'flex min-h-screen w-full flex-col items-center justify-center text-center',
                className
            )}
        >
            <Image
                src={'/auth/403.jpg'}
                alt="forbidden"
                width={500}
                height={400}
            />
            <h1 className="mb-2 pt-10 text-2xl font-bold">
                {messages('auth.forbidden.title')}
            </h1>
            <p className="max-w-[30rem] text-base">
                {messages('auth.forbidden.description')}
            </p>
            <div className="mt-4 flex w-64 flex-col gap-2">
                <Link href={APP_ROUTES.DASHBOARD}>
                    <Button type="primary" block>
                        {messages('dashboard.label')}
                    </Button>
                </Link>
                <Button onClick={logout}>
                    {messages('accessDenied.loginByOtherAccount')}
                </Button>
            </div>
        </div>
    );
}

export default Forbidden;
