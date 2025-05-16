import Image from 'next/image';
import { TrackData } from '../../types';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
type Props = CardProps & {
    data: TrackData;
};

export default function GridCardTracks({ data, ...props }: Props) {
    return (
        <Card
            {...props}
            className="custom-card-body !bg-card-bg"
            cover={
                <div className="relative overflow-hidden">
                    <Image
                        className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={data.thumbnail}
                        width={300}
                        height={300}
                    />
                    {/* <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                        <span> {albumStatus} </span>
                    </div> */}
                </div>
            }
        >
            <Meta
                title={
                    <CustomTooltip title={data.title}>
                        <span className="cursor-pointer text-sm">
                            {data.title}
                        </span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex justify-between font-medium">
                        <span> {data.artist} </span>

                        <p className="flex justify-between">
                            <span>
                                {formattedDate(
                                    data.releaseDate,
                                    DATE_FORMAT.DATE_ONLY
                                )}
                            </span>
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
