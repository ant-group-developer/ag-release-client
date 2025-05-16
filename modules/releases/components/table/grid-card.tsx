import CardAlbum from '@/modules/dashboard/components/card/card-album';
import { ReleasesData } from '../../types';

type Props = {
    data: ReleasesData;
};

export default function GridCardRelease({ data }: Props) {
    return (
        // <div className="flex aspect-square flex-col overflow-hidden rounded-xl bg-card-bg hover:bg-card-bg-hover">
        //     <div className="relative h-full w-full cursor-pointer overflow-hidden p-2">
        //         <Image
        //             src={data.thumbnail}
        //             alt={data.title}
        //             width={500}
        //             height={500}
        //             className="h-full w-full rounded-lg object-cover"
        //         />
        //     </div>

        //     <div className="p-2">
        //         <p className="font-semibold">{data.title}</p>
        //         <p>
        //             {data.artist}{' '}
        //             <span className="h-1 w-1 rounded-full bg-card-bg"></span>
        //             {formattedDate(data.releaseDate, DATE_FORMAT.DATE_ONLY)}
        //         </p>
        //     </div>
        // </div>
        <CardAlbum album={data} />
    );
}
