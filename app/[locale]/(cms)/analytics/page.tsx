'use client';
import AppContainer from '@/components/app-container';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Analytics({}: Props) {
    const messages = useTranslations();
    return <AppContainer title={messages('analytics.label')}>b</AppContainer>;
}
