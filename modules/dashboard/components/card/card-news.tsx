import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { NewsData } from '@/modules/news/types';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';

type Props = CardProps & {
    data: NewsData;
};

export default function CardNews({ data, ...props }: Props) {
    return (
        <Card
            {...props}
            className="!border-gray-200"
            cover={
                <div className="overflow-hidden">
                    <Image
                        className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={data.image}
                        width={500}
                        height={500}
                    />
                </div>
            }
            size="small"
        >
            <Meta
                title={
                    <CustomTooltip title="Meet Revelator at Music Biz 2025: Breaking Borders & Building Global Strategies">
                        <span className="cursor-pointer">{data.title}</span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col gap-1">
                        <p>
                            {formattedDate(data.date, DATE_FORMAT.DATE_ONLY)} |
                            30 lượt xem
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
