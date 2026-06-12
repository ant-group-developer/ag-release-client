import { Tag } from 'antd';

type Props = {
    status?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
    success: 'success',
    processing: 'processing',
    pending: 'warning',
    failed: 'error',
    error: 'error',
};

export default function ChannelStatusTag({ status }: Props) {
    if (!status) return <>-</>;

    const normalizedStatus = status.toLowerCase();

    return (
        <Tag color={STATUS_COLORS[normalizedStatus]}>
            {normalizedStatus.replaceAll('_', ' ')}
        </Tag>
    );
}
