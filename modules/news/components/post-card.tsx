import { FALLBACK_IMAGE_HORIZONTAL } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { Card, Typography, theme } from 'antd';
import { CardProps } from 'antd/lib';
import { Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { NewsData } from '../types';

type Props = CardProps & {
    data: NewsData;
};

export default function PostCard({ data, ...props }: Props) {
    const locale = useLocale();
    const messages = useTranslations();
    const { token } = theme.useToken();

    const categoryName = getNameByLocale(
        data?.newsCategory?.nameEn,
        data?.newsCategory?.nameVi,
        locale
    );

    return (
        <Card
            {...props}
            hoverable
            variant="outlined"
            className="group flex flex-col justify-between overflow-hidden rounded-2xl"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...props.style,
            }}
            styles={{
                body: {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                },
            }}
            cover={
                data?.thumbnail ? (
                    <div
                        className="relative aspect-[16/10] w-full overflow-hidden border-b"
                        style={{ borderColor: token.colorBorderSecondary }}
                    >
                        <Image
                            src={data.thumbnail || FALLBACK_IMAGE_HORIZONTAL}
                            alt={data.title || 'News thumbnail'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : null
            }
        >
            <div className="space-y-3">
                <div className="space-y-1">
                    {categoryName && (
                        <Typography.Text
                            style={{ color: token.colorPrimary }}
                            className="mb-1 block text-xs font-semibold tracking-wider"
                        >
                            {categoryName}
                        </Typography.Text>
                    )}
                    <Typography.Text
                        strong
                        className="line-clamp-2 text-base font-bold transition-colors group-hover:opacity-80"
                    >
                        {data?.title}
                    </Typography.Text>
                    <Typography.Paragraph
                        type="secondary"
                        className="!mb-0 line-clamp-3 text-sm leading-relaxed"
                    >
                        {data?.description || data?.title}
                    </Typography.Paragraph>
                </div>
            </div>
            <div
                className="mt-6 flex items-center justify-between border-t pt-3 text-xs font-medium"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <span className="flex items-center gap-1.5">
                    <Calendar
                        className="h-3.5 w-3.5"
                        style={{ color: token.colorTextSecondary }}
                    />
                    <Typography.Text type="secondary" className="text-xs">
                        {formattedDate(data?.createdAt, DATE_FORMAT.DATE_ONLY)}
                    </Typography.Text>
                </span>
                <Typography.Text
                    style={{ color: token.colorPrimary }}
                    className="text-xs font-semibold transition-transform duration-300 group-hover:translate-x-1"
                >
                    {messages('landing.newsReadMore') || 'Đọc tiếp'}
                </Typography.Text>
            </div>
        </Card>
    );
}
