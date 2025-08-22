import { getIntlCodeByScanCopyrightStatus } from '@/helpers/intl';
import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { SCAN_COPYRIGHT_STATUS } from '../../enums';

type Props = {
    status: SCAN_COPYRIGHT_STATUS;
};

export default function TagScanCopyright({ status }: Props) {
    const messages = useTranslations();
    const getColorStatus = (status: SCAN_COPYRIGHT_STATUS) => {
        switch (status) {
            case SCAN_COPYRIGHT_STATUS.FINISHED:
                return 'green';
            case SCAN_COPYRIGHT_STATUS.REJECTED:
                return 'red';
            case SCAN_COPYRIGHT_STATUS.UN_SCANNED:
                return 'blue';
            case SCAN_COPYRIGHT_STATUS.WARNING:
                return 'yellow';
            default:
                return 'red';
        }
    };
    const color = getColorStatus(status);
    return (
        <Tag color={color}>
            {messages(getIntlCodeByScanCopyrightStatus(status) as any)}
        </Tag>
    );
}
