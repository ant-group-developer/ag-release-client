import { Button, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {};

export default function ListCardRelease({}: Props) {
    const messages = useTranslations();

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between">
                <Title level={4}>
                    {messages('release.lastedRelease') + ' (20)'}
                </Title>

                <Button className="!rounded-2xl">Xem thêm</Button>
            </div>
            <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card
                        className="hover:bg-gray-300"
                        key={index}
                        cover={
                            <div className="overflow-hidden p-2">
                                <Image
                                    className="cursor-pointer overflow-hidden rounded-md object-cover"
                                    alt="example"
                                    src="https://api.revelator.com/media/image/9e7db1ed-cfb5-454e-9048-d7bf91999c9d"
                                    width={300}
                                    height={300}
                                />
                            </div>
                        }
                        size="small"
                    >
                        <Meta
                            title="Beneath the Clouds"
                            description={
                                <div className="flex flex-col gap-1">
                                    <p>Zen Record</p>
                                    {/* <p className="flex justify-between">
                                    <span>7799192039457</span>
                                    <span>LMB2509349</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>April 22, 2025</span>
                                    <span>10 TRACKS</span>
                                </p> */}
                                </div>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}
