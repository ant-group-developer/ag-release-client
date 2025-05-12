import { ORDER_TYPE } from '@/modules/order/enums';
import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = TagProps & {
    type: ORDER_TYPE;
};

type MessagesKey =
    | 'order.type.image'
    | 'order.type.video'
    | 'common.source'
    | 'common.videoAndImage';

const typeMap: Record<ORDER_TYPE, { labelKey: MessagesKey; color: string }> = {
    [ORDER_TYPE.IMAGE]: { labelKey: 'order.type.image', color: 'volcano' },
    [ORDER_TYPE.VIDEO]: { labelKey: 'order.type.video', color: 'purple' },
    [ORDER_TYPE.VIDEO_AND_THUMBNAIL]: {
        labelKey: 'common.videoAndImage',
        color: 'blue',
    },
    [ORDER_TYPE.SOURCE]: { labelKey: 'common.source', color: 'green' },
};

export default function OrderTypeTag({ type, ...props }: Props) {
    const messages = useTranslations();
    const typeData = typeMap[type];

    if (!type) {
        return null;
    }

    return (
        <Tag color={typeData.color} bordered={false} {...props}>
            {messages(typeData.labelKey)}
        </Tag>
    );
}
