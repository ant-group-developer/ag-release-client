import { defaultConfig } from '@/constants/env';
import { HOME_ROUTE } from '@/enums/routes';
import { cn } from '@/helpers/common';
import Image from 'next/image';
import Link from 'next/link';
import { AppLogoProps } from './app-logo';

type Props = {
    className?: string;
    wrapperClassName?: string;
    size?: number;
} & AppLogoProps;

function AppLogoGradient({ className, wrapperClassName, size = 70 }: Props) {
    const companyName = defaultConfig.APP_SHORT_NAME;
    const companyLogo = defaultConfig.APP_LOGO;

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
            />
            <h2
                className={cn(
                    'gradient-text logo-font text-4xl uppercase',
                    className
                )}
            >
                {companyName}
            </h2>
        </Link>
    );
}

export default AppLogoGradient;
