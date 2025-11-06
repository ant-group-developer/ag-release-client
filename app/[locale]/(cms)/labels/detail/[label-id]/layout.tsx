'use client';
import { LabelProvider } from '@/modules/labels/hooks/use-label-context';
import { PropsWithChildren } from 'react';
import LabelDetailLayout from './label-layout';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <LabelProvider>
            <LabelDetailLayout>{children}</LabelDetailLayout>
        </LabelProvider>
    );
}
