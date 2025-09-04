import SeeMoreButton from '@/components/ui/button/see-more-button';
import FlatList from '@/components/ui/flat-list';
import AppGrid from '@/components/ui/grid/app-grid';
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
            <div className="flex items-center justify-between pb-2">
                <p className="text-lg font-bold">
                    {messages('release.lastedReleases')}
                </p>

                <div>
                    <SeeMoreButton />
                </div>
            </div>
            <AppGrid className="overflow-hidden">
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
