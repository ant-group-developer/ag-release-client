import AppCard from '@/components/ant-music/app-card';
import { fakeDspData } from '@/modules/dashboard/constants/mockData';
import ArtistProfilesList from '../../../list/artist-profiles';

type Props = {};

export default function ArtistProfileCard({}: Props) {
    return (
        <AppCard title="Hồ sơ nghệ sĩ">
            <div>
                <ArtistProfilesList
                    list={fakeDspData.map((item) => ({
                        id: item.id.toString(),
                        icon: item.image,
                        name: item.name,
                    }))}
                />
            </div>
        </AppCard>
    );
}
