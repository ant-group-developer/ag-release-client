import { getLocale } from 'next-intl/server';
import LandingPage from './landing/page';

interface PageProps {
    params: {
        locale: string;
    };
}

export default async function Home({ params }: PageProps) {
    const locale = params?.locale || (await getLocale()) || 'vi';
    // const session = await getServerSession(authOptions);

    // if (session) {
    //     redirect({ href: DEFAULT_ROUTE, locale });
    // }

    return <LandingPage params={{ locale }} />;
}
