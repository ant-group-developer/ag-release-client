import CardAlbum from '@/modules/dashboard/components/card/card-album';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function GridCardRelease({ data }: Props) {
    return <CardAlbum album={data} />;
}
