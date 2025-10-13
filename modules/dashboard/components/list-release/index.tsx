import SeeMoreButton from '@/components/ui/button/see-more-button';
import FlatList from '@/components/ui/flat-list';
import AppGrid from '@/components/ui/grid/app-grid';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { ReleasesData } from '@/modules/releases/types';
import { useTranslations } from 'next-intl';
import CardRelease from '../card/card-release';

type Props = {
    data: ReleasesData[];
};

export default function ListRelease({ data }: Props) {
    const messages = useTranslations();

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold">
                    {messages('release.latestReleases')}
                </p>

                <Link href={APP_ROUTES.RELEASES}>
                    <SeeMoreButton type="default" />
                </Link>
            </div>
            <AppGrid className="overflow-hidden py-4">
                <FlatList
                    data={data}
                    renderItem={({ item }) => <CardRelease data={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    loading={false}
                    className="contents"
                />
            </AppGrid>
        </div>
    );
}
