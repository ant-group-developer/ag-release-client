import { Card } from 'antd';
import { CardProps } from 'antd/lib';
import Image from 'next/image';
import { NewsData } from '../types';

type Props = CardProps & {
    data: NewsData;
};
const { Meta } = Card;
export default function PostCard({ data }: Props) {
    return (
        <Card
            hoverable
            cover={
                <Image
                    draggable={false}
                    alt="example"
                    src={data?.thumbnail}
                    width={400}
                    height={250}
                    className="aspect-video"
                />
            }
        >
            <Meta
                title={data?.title}
                description={
                    <p className="line-clamp-2">{data?.description}</p>
                }
            />
        </Card>
    );
}
