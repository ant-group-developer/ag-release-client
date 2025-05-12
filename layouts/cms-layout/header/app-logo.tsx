import AppLogoWithText from '@/components/logo/app-logo-with-text';

type Props = {};

const logoHeight = 50;

function Logo({}: Props) {
    return (
        <AppLogoWithText
            size={logoHeight}
            className="text-text-color hidden text-2xl md:block"
        />
    );
}

export default Logo;
