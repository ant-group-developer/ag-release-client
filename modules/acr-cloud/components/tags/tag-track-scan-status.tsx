import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { SCAN_STATUS } from '../../enums';

type Props = {
    status: SCAN_STATUS;
};

export default function TagScanStatus({ status }: Props) {
    const messages = useTranslations();
    return (
        <Tag color={getScanStatusColor(status)}>
            {messages(getScanStatusTranslationKey(status) as any)}
        </Tag>
    );
}

export const getScanStatusColor = (status: SCAN_STATUS): string => {
    switch (status) {
        case SCAN_STATUS.RUNNING:
            return 'processing'; // blue
        case SCAN_STATUS.PENDING:
            return 'warning'; // orange/yellow
        case SCAN_STATUS.FINISHED:
            return 'success'; // green
        case SCAN_STATUS.FAILED:
            return 'error'; // red
        case SCAN_STATUS.CANCEL:
            return 'error'; // gray
        default:
            return 'default';
    }
};

export const getScanStatusTranslationKey = (status: SCAN_STATUS): string => {
    switch (status) {
        case SCAN_STATUS.RUNNING:
            return 'tracks.status.scanning';
        case SCAN_STATUS.PENDING:
            return 'tracks.status.pending';
        case SCAN_STATUS.FINISHED:
            return 'tracks.status.finished';
        case SCAN_STATUS.FAILED:
            return 'tracks.status.failed';
        case SCAN_STATUS.CANCEL:
            return 'tracks.status.cancel';
        default:
            return 'tracks.status.unknown';
    }
};
