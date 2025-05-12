import { COOKIES_KEY } from '@/constants/common';
import CMSLayout from '@/layouts/cms-layout';
import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';

export default function CmsLayout({ children }: PropsWithChildren) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get(COOKIES_KEY.TOKEN)?.value;

    return <CMSLayout accessToken={accessToken}>{children}</CMSLayout>;
}
