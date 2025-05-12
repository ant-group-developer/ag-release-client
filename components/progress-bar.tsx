'use client';

import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';

export function ProgressBar() {
    const pathname = usePathname();
    NProgress.configure({
        showSpinner: false,
        speed: 400,
    });

    useEffect(() => {
        NProgress.start();
        // Giả lập delay hoặc kết thúc khi đã tải xong, bạn có thể tinh chỉnh theo nhu cầu
        NProgress.done();
    }, [pathname]);

    return null;
}
