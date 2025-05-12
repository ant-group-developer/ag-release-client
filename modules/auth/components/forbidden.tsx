import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAuth } from '../hooks/use-auth';

type Props = {};

function Forbidden({}: Props) {
    const messages = useTranslations();
    const { logout } = useAuth();
    return (
        <div className="grid min-h-screen w-full place-content-center text-center">
            <Image
                src={'/auth/access-denied.jpg'}
                alt="forbidden"
                width={400}
                height={300}
            />
            <h1 className="mb-2 pt-10 text-2xl font-bold">
                {messages('auth.forbiddenTitle')}
            </h1>
            <p className="text-lg font-medium">
                {messages('auth.forbiddenDescription')}
            </p>
            <Button
                type="primary"
                onClick={logout}
                size="large"
                className="mt-4"
            >
                {messages('accessDenied.loginByOtherAccount')}
            </Button>
        </div>
    );
}

export default Forbidden;
