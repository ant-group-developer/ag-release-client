import { LOCALE } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface LocaleSelectProps extends SelectProps {
    width?: number | string;
}

export default function LocaleSelect({
    width = 150,
    ...props
}: LocaleSelectProps) {
    const { locale, switchLocale } = useLocale();
    const messages = useTranslations();

    const options = [
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Image
                        height={15}
                        width={30}
                        src={'/languages/vi.svg'}
                        alt={LOCALE.VI}
                    />
                    {messages('language.vietnamese')}
                </p>
            ),
            value: LOCALE.VI,
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Image
                        height={15}
                        width={30}
                        src={'/languages/en.svg'}
                        alt={LOCALE.EN}
                    />
                    {messages('language.english')}
                </p>
            ),
            value: LOCALE.EN,
        },
    ];

    return (
        <Select
            options={options}
            onChange={switchLocale}
            value={locale}
            style={{ width }}
            {...props}
        />
    );
}
