import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import Title from 'antd/lib/typography/Title';
import Image from 'next/image';
type Props = {};

export default function ListNews({}: Props) {
    return (
        <div className="mt-8">
            <Title level={4}>{'Tin tức sản phẩm mới'}</Title>
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card
                        className="hover:bg-gray-300"
                        key={index}
                        cover={
                            <div className="overflow-hidden p-2">
                                <Image
                                    className="cursor-pointer overflow-hidden rounded-md object-cover"
                                    alt="example"
                                    src="https://cms.revelator.com/assets/3c43b946-82e8-43fa-8fc0-dc923cba0302"
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
                                    <span className="cursor-pointer">
                                        Meet Revelator at Music Biz 2025:
                                        Breaking Borders & Building Global
                                        Strategies
                                    </span>
                                </CustomTooltip>
                            }
                            description={
                                <div className="flex flex-col gap-1">
                                    <p>6 tháng 5, 2025 | 30 lượt xem</p>
                                </div>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}
