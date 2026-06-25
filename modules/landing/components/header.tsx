'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Header() {
    const tAuth = useTranslations('auth');

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/70 border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="ANT Group Logo"
                        width={36}
                        height={36}
                        className="rounded-lg object-contain bg-zinc-900 p-1"
                    />
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        ANT Group
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none rounded-full h-10 px-6 font-semibold flex items-center shadow-lg shadow-purple-500/20"
                        >
                            {tAuth('signIn.submit') || 'Đăng nhập'}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
