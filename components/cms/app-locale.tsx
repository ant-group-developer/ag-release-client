import { LOCALE } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { Dropdown } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const width = 40;
const height = 30;

function AppLocale() {
    const { locale, switchLocale } = useLocale();
    const messages = useTranslations();

    const items = [
        {
            label: (
                <p className="flex items-center justify-start gap-2 text-base font-medium">
                    <Image
                        src={'/languages/vi.svg'}
                        className="hidden h-full md:block"
                        width={width}
                        height={height}
                        alt={LOCALE.VI}
                        style={{ height: 'auto' }}
                    />
                    {messages('language.vietnamese')}
                </p>
            ),
            key: LOCALE.VI,
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2 text-base font-medium">
                    <Image
                        src={'/languages/en.svg'}
                        className="hidden h-full md:block"
                        width={width}
                        height={height}
                        alt={LOCALE.EN}
                        style={{ height: 'auto' }}
                    />
                    {messages('language.english')}
                </p>
            ),
            key: LOCALE.EN,
        },
    ];

    const currentLocale = items.find((item) => item.key === locale);

    function onClick({ key }: { key: any }) {
        switchLocale(key);
    }

    return (
        <Dropdown
            menu={{
                items: items.filter((item) => item.key !== locale),
                onClick,
                className: 'text-text-color',
            }}
            trigger={['click']}
        >
            <div className="cursor-pointer rounded-3xl px-4 py-1 !text-white">
                {currentLocale?.label}
            </div>
        </Dropdown>
    );
}

export default AppLocale;
