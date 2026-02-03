import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';
import { RELEASES_STATUS } from '../../enums';

type Props = TagProps & {
    status: RELEASES_STATUS;
};

export default function ReleaseStatusTag({ status, ...props }: Props) {
    const messages = useTranslations();
    let color = 'green';
    switch (status) {
        case RELEASES_STATUS.DRAFT:
            color = 'default';
            break;
        case RELEASES_STATUS.ISSUES:
            color = 'red';
            break;
        case RELEASES_STATUS.PROCESSING:
            color = 'blue';
            break;
        case RELEASES_STATUS.TAKEN_DOWN:
            color = 'yellow';
            break;
        case RELEASES_STATUS.DISTRIBUTED:
            color = 'green';
            break;
        case RELEASES_STATUS.NEVER_DISTRIBUTED:
            color = 'magenta';
            break;
        default:
            break;
    }
    if (!status) return;
    return (
        <Tag color={color} {...props}>
            {messages(getIntlCodeByReleaseStatus(status))}
        </Tag>
    );
}
