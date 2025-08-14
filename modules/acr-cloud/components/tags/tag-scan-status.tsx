import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { TRACK_SCAN_STATUS } from '../../enums';

type Props = {
    status: TRACK_SCAN_STATUS;
};

export default function TagScanStatus({ status }: Props) {
    const messages = useTranslations();
    return (
        <Tag color={getScanStatusColor(status)}>
            {messages(getScanStatusTranslationKey(status) as any)}
        </Tag>
    );
}

export const getScanStatusColor = (status: TRACK_SCAN_STATUS): string => {
    switch (status) {
        case TRACK_SCAN_STATUS.RUNNING:
            return 'processing'; // blue
        case TRACK_SCAN_STATUS.PENDING:
            return 'warning'; // orange/yellow
        case TRACK_SCAN_STATUS.FINISHED:
            return 'success'; // green
        case TRACK_SCAN_STATUS.FAILED:
            return 'error'; // red
        case TRACK_SCAN_STATUS.CANCEL:
            return 'error'; // gray
        default:
            return 'default';
    }
};

export const getScanStatusTranslationKey = (
    status: TRACK_SCAN_STATUS
): string => {
    switch (status) {
        case TRACK_SCAN_STATUS.RUNNING:
            return 'tracks.status.running';
        case TRACK_SCAN_STATUS.PENDING:
            return 'tracks.status.pending';
        case TRACK_SCAN_STATUS.FINISHED:
            return 'tracks.status.finished';
        case TRACK_SCAN_STATUS.FAILED:
            return 'tracks.status.failed';
        case TRACK_SCAN_STATUS.CANCEL:
            return 'tracks.status.cancel';
        default:
            return 'tracks.status.unknown';
    }
};
