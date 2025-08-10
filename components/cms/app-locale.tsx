import { LOCALE } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { Button, ButtonProps, Dropdown, DropdownProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface AppLocaleProps extends DropdownProps {
    buttonProps?: ButtonProps;
}

export default function AppLocale({ buttonProps, ...props }: AppLocaleProps) {
    const { locale, switchLocale } = useLocale();
    const messages = useTranslations();

    const items: ItemType[] = [
        {
            type: 'group',
            label: messages('common.settingNote'),
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
            key: LOCALE.EN,
        },
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
            key: LOCALE.VI,
        },
    ];

    const currentLocale = items.find(
        (item) => item?.key === locale
    ) as MenuItemType;

    return (
        <Dropdown
            trigger={['click']}
            {...props}
            menu={{
                items,
                onClick: ({ key }) => {
                    switchLocale(key as LOCALE);
                },
                activeKey: locale,
            }}
        >
            <Button {...buttonProps}>{currentLocale?.label}</Button>
        </Dropdown>
    );
}
