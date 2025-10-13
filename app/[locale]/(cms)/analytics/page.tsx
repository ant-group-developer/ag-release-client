import { redirect } from '@/i18n/routing';
import { useLocale } from 'next-intl';

type Props = {};

export default function Analytics({}: Props) {
    const locale = useLocale();
    return redirect({ href: '/analytics/dashboard', locale });
}
