import AppGrid from '@/components/ui/grid/app-grid';
import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { Card, Skeleton, Spin } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useLocale, useTranslations } from 'next-intl';
import { NewsData } from '../../types';

type Props = {
    data: NewsData[];
    loading: boolean;
    scroll?: {
        x?: number;
        y?: number;
    };
};

export default function NewsGridTable({ scroll, data, loading }: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    return (
        <Spin spinning={loading}>
            <AppGrid
                className="px-4 py-4"
                style={{
                    maxHeight: scroll?.y,
                    maxWidth: scroll?.x,
                    overflowY: 'auto',
                }}
            >
                {data?.map((item) => {
                    const title = item?.title;
                    return (
                        <div key={item?.id}>
                            <Card
                                className="custom-card-body !bg-card-bg dark:!bg-card-bg-dark"
                                cover={
                                    <div className="relative h-[150px] overflow-hidden">
                                        <Link href={`news/${item?.slug}`}>
                                            {loading ? (
                                                <Skeleton.Node
                                                    active
                                                    className="!w-full !rounded-lg"
                                                />
                                            ) : (
                                                <ImageFallback
                                                    className="h-full w-full cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                                                    alt="example"
                                                    src={
                                                        item?.thumbnail ||
                                                        FALLBACK_IMAGE
                                                    }
                                                    width={300}
                                                    height={300}
                                                />
                                            )}
                                        </Link>
                                        <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                                            <span>{item?.status}</span>
                                        </div>
                                    </div>
                                }
                            >
                                <Meta
                                    title={
                                        <CustomTooltip title={title}>
                                            <div className="cursor-pointer truncate text-sm">
                                                {title}
                                            </div>
                                        </CustomTooltip>
                                    }
                                    description={
                                        <div className="flex flex-col font-medium">
                                            <p className="flex justify-between">
                                                {/* <p>
                                                    {' '}
                                                    {
                                                        data?.albumFormat.name
                                                    }{' '}
                                                </p> */}
                                                <span>
                                                    {formattedDate(
                                                        item?.createdAt,
                                                        DATE_FORMAT.DATE_ONLY
                                                    )}{' '}
                                                </span>
                                            </p>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                    );
                })}
            </AppGrid>
        </Spin>
    );
}
