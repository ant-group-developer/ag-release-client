import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = TagProps & {
    status: RELEASE_DSP_DELIVERY_STATUS;
};

export default function ReleaseDspStatusTag({ status, ...props }: Props) {
    const messages = useTranslations();
    let color = 'default';
    switch (status) {
        case RELEASE_DSP_DELIVERY_STATUS.DRAFT:
            color = 'default';
            break;
        case RELEASE_DSP_DELIVERY_STATUS.PROCESSING:
            color = 'blue';
            break;
        case RELEASE_DSP_DELIVERY_STATUS.ISSUES:
            color = 'orange';
            break;
        case RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED:
            color = 'green';
            break;
        case RELEASE_DSP_DELIVERY_STATUS.TAKEN_DOWN:
            color = 'gold';
            break;
        case RELEASE_DSP_DELIVERY_STATUS.NEVER_DISTRIBUTED:
            color = 'default';
            break;
        default:
            color = 'default';
            break;
    }
    if (!status) return;
    return (
        <Tag color={color} {...props}>
            {messages(`releaseDsp.status.${status}`)}
        </Tag>
    );
}
