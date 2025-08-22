import { APP_ROUTES } from '@/enums/routes';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div>
                <Image
                    src={'/image/404.jpg'}
                    alt="404"
                    width={500}
                    height={300}
                />
            </div>
            <h2 className="text-2xl font-bold">Sorry, Page Not Found</h2>
            <p className="text-muted-foreground text-base">
                The page you requested could not be found.
            </p>
            <Link href={APP_ROUTES.HOME} className="mt-6">
                <Button type="primary" size="large">
                    Go back
                </Button>
            </Link>
        </div>
    );
}
