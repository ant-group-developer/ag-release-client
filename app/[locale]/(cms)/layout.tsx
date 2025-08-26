import CMSLayout from '@/layouts/cms-layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return <CMSLayout>{children}</CMSLayout>;
}
