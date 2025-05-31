import CardRelease from '@/modules/dashboard/components/card/card-album';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function GridCardRelease({ data }: Props) {
    return <CardRelease album={data} />;
}
