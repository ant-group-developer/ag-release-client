import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { CHANNEL_STATUS } from '../../enums';

type Props = {
    status?: string | null;
};

export const getChannelStatusColor = (status: CHANNEL_STATUS) => {
    switch (status) {
        case CHANNEL_STATUS.REQUESTED:
            return 'warning';
        case CHANNEL_STATUS.PROCESSING:
            return 'processing';
        case CHANNEL_STATUS.SUCCESS:
            return 'success';
        case CHANNEL_STATUS.FAILED:
            return 'error';
        default:
            return 'default';
    }
};

export default function ChannelStatusTag({ status }: Props) {
    const message = useTranslations();

    if (!status) return <>-</>;

    const translationKey = `channel.status.${status.toUpperCase()}`;
    const label = message.has(translationKey as any)
        ? message(translationKey as any)
        : status;

    return (
        <Tag
            color={getChannelStatusColor(status as CHANNEL_STATUS)}
            className="!mr-0"
        >
            {label}
        </Tag>
    );
}
