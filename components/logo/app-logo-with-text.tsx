import { defaultConfig } from '@/constants/env';
import { HOME_ROUTE } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { Image } from 'antd';
import Link from 'next/link';
import { AppLogoProps } from './app-logo';

type Props = {
    className?: string;
    wrapperClassName?: string;
    size?: number;
} & AppLogoProps;

function AppLogoWithText({ className, wrapperClassName, size = 70 }: Props) {
    // const { data } = useGetSettingPublic();
    // const companyName = data?.website || defaultConfig.APP_SHORT_NAME;
    // const companyLogo = data?.logoUrl || '/logo.png';

    const companyName = defaultConfig.APP_SHORT_NAME;
    const companyLogo = '/logo.png';

    return (
        <Link
            href={HOME_ROUTE}
            className={cn('flex w-fit items-center gap-2', wrapperClassName)}
        >
            <Image
                src={companyLogo}
                alt={companyName}
                height={size}
                width={size}
                fallback="/logo.png"
                preview={false}
            />
            <h2
                className={cn(
                    'logo-font text-title-color text-4xl uppercase',
                    className
                )}
            >
                {companyName}
            </h2>
        </Link>
    );
}

export default AppLogoWithText;
