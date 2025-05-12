import TypeOrderProductSelect from '@/components/ui/select/type-order-product-select';
import ProductTypeTag from '@/components/ui/tag/product-type-tag';
import { cn, formattedDate } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { Avatar, Empty, Skeleton } from 'antd';
import { Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CommentRatingData } from '../types';

interface Props {
    className?: string;
    data: CommentRatingData[];
    totalUserCreator: number;
}

export default function CommentList({
    className,
    data,
    totalUserCreator,
}: Props) {
    const locale = useLocale();
    const messages = useTranslations();
    const [commentData, setCommentData] = useState(data);
    // console.log(commentData);

    const handleFilterComment = (type: PRODUCT_TYPE) => {
        if (!type) return setCommentData(data);
        const newData = data.filter(
            (item) => item.orderProduct.productType.code === type
        );
        setCommentData(newData);
    };

    useEffect(() => {
        setCommentData(data);
    }, [data]);

    if (!data) return <Skeleton avatar paragraph={{ rows: 4 }} />;
    return (
        <div className="grow">
            <div className="mb-2 flex justify-between">
                <b>
                    {commentData.length} {messages('common.comment')}
                </b>
                {/* <b>
                    {totalUserCreator} {messages('common.review')}
                </b> */}
                <TypeOrderProductSelect
                    variant="filled"
                    allowClear
                    className="w-[130px]"
                    placeholder={messages('filter.filterComment')}
                    onChange={(value) => handleFilterComment(value)}
                />
            </div>

            <div className={cn(className)}>
                {commentData.length > 0 ? (
                    commentData.map((item, index) => (
                        <div
                            key={index}
                            className="flex cursor-pointer gap-2 rounded-lg px-3 py-3 hover:bg-[rgba(10,143,220,0.1)]"
                        >
                            <Avatar size={36}>
                                {item.userCreator.name[0]}
                            </Avatar>

                            <div className="flex flex-1 flex-col overflow-x-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {item.rate && (
                                            <div className="flex w-[50px] items-center justify-center space-x-1 !rounded-2xl !bg-green-600 text-white">
                                                <span>{item.rate}</span>
                                                <Star size={14} />
                                            </div>
                                        )}
                                        <b className="inline-block max-w-32 truncate">
                                            {item.userCreator.name}
                                        </b>
                                    </div>

                                    <div>
                                        {/* <Tag
                                            bordered={false}
                                            color={
                                                item.orderProduct.type ===
                                                UPLOAD_TYPE.IMAGE
                                                    ? 'volcano'
                                                    : 'purple'
                                            }
                                        >
                                            {item.orderProduct.type ===
                                            UPLOAD_TYPE.IMAGE
                                                ? messages('common.image')
                                                : messages('common.video')}
                                        </Tag> */}
                                        <ProductTypeTag
                                            color={
                                                item?.orderProduct?.productType
                                                    ?.color
                                            }
                                            name={getNameByLocale(
                                                item?.orderProduct?.productType
                                                    ?.nameEn,
                                                item?.orderProduct?.productType
                                                    ?.nameVi,
                                                locale
                                            )}
                                        />
                                        <span className="text-xs text-gray-400">
                                            {formattedDate(item.dateCreated)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-wrap break-words">
                                    {item.comment}
                                </p>
                            </div>

                            {/* Delete ... */}
                            {/* <div>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: '1',
                                                label: (
                                                    <p>
                                                        {messages(
                                                            'common.delete'
                                                        )}
                                                    </p>
                                                ),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <EllipsisVertical
                                        size={18}
                                        className="cursor-pointer opacity-100 hover:opacity-40"
                                    />
                                </Dropdown>
                            </div> */}
                        </div>
                    ))
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </div>
    );
}
