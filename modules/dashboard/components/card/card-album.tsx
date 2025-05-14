import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';

type Props = CardProps & {
    album: AlbumData;
};

export default function CardAlbum({ album, ...props }: Props) {
    return (
        <Card
            {...props}
            className="custom-card-body !border-gray-200"
            cover={
                <div className="relative overflow-hidden">
                    <Image
                        className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={album.image}
                        width={300}
                        height={300}
                    />
                    <div className="bg-card-bg-opacity absolute left-0 top-4 rounded-r-xl p-1 text-xs font-bold">
                        <span> {album.status} </span>
                    </div>
                </div>
            }
        >
            <Meta
                title={
                    <CustomTooltip title={album.title}>
                        <span className="cursor-pointer"> {album.title}</span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col">
                        <p> {album.artist} </p>

                        <p className="flex justify-between">
                            <span> {album.date} </span>
                            <span> {album.tracks} TRACKS </span>
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
