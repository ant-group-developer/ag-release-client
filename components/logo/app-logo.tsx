import { defaultConfig } from '@/constants/env';
import { HOME_ROUTE } from '@/enums/routes';
import Image from 'next/image';
import Link from 'next/link';

export type AppLogoProps = {
    height?: number;
    width?: number;
};

function AppLogo({ height = 50, width = 50 }: AppLogoProps) {
    const companyName = defaultConfig.APP_SHORT_NAME;
    const companyLogo = '/logo.png';

    return (
        <Link href={HOME_ROUTE}>
            <Image
                src={companyLogo}
                alt={companyName}
                height={height}
                width={width}
            />
        </Link>
    );
}

export default AppLogo;
