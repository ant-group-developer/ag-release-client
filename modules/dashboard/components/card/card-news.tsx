import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { NewsData } from '@/modules/news/types';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useLocale, useTranslations } from 'next-intl';

type Props = CardProps & {
    data: NewsData;
};

export default function CardNews({ data, ...props }: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    return (
        <Card
            {...props}
            className="!bg-card-bg dark:!bg-card-bg-dark"
            cover={
                <div className="h-[180px] w-[350px] overflow-hidden">
                    <ImageFallback
                        fallbackSrc={FALLBACK_IMAGE}
                        className="h-full w-full cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={data?.thumbnail}
                        width={350}
                        height={200}
                    />
                </div>
            }
            size="small"
        >
            <Meta
                title={
                    <CustomTooltip title="Meet Revelator at Music Biz 2025: Breaking Borders & Building Global Strategies">
                        <span className="cursor-pointer">
                            {getNameByLocale(
                                data?.titleEn,
                                data?.titleVi,
                                locale
                            )}
                        </span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col gap-1">
                        <p>
                            {formattedDate(
                                data.createdAt,
                                DATE_FORMAT.DATE_ONLY
                            )}{' '}
                            {/* | 30 {messages('common.views')} */}
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
