import SeeMoreButton from '@/components/ui/button/see-more-button';
import AppGrid from '@/components/ui/grid/app-grid';
import { useTranslations } from 'next-intl';
import { fakeReleasesData } from '../../constants/mockData';
import CardAlbum from '../card/card-album';

type Props = {};

export default function ListRelease({}: Props) {
    const messages = useTranslations();

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between pb-2">
                <p className="text-lg font-bold">
                    {messages('releases.lastedRelease')}
                </p>

                <div>
                    <SeeMoreButton />
                </div>
            </div>
            <AppGrid className="overflow-hidden">
                {fakeReleasesData.slice(0, 14).map((item, index) => (
                    <CardAlbum key={index} album={item} />
                ))}
            </AppGrid>
        </div>
    );
}
