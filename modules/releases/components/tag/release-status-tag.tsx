import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';
import { RELEASES_STATUS } from '../../enums';

type Props = TagProps & {
    status: RELEASES_STATUS;
};

export default function ReleaseStatusTag({ status, ...props }: Props) {
    const messages = useTranslations();
    let color = 'default';
    switch (status) {
        case RELEASES_STATUS.DRAFT:
            color = 'default';
            break;
        case RELEASES_STATUS.PROCESSING:
            color = 'blue';
            break;
        case RELEASES_STATUS.SUBMITTED:
            color = 'cyan';
            break;
        case RELEASES_STATUS.AWAITING_ACTION:
            color = 'orange';
            break;
        case RELEASES_STATUS.FAILED:
            color = 'red';
            break;
        case RELEASES_STATUS.TAKEN_DOWN:
            color = 'gold';
            break;
        case RELEASES_STATUS.DISTRIBUTED:
            color = 'green';
            break;
        case RELEASES_STATUS.PARTIALLY_FAILED:
            color = 'volcano';
            break;
        default:
            color = 'default';
            break;
    }
    if (!status) return;
    return (
        <Tag color={color} {...props}>
            {messages(`release.status.${status}`)}
        </Tag>
    );
}
