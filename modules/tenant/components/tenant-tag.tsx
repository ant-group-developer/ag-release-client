import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_TYPE } from '../enums';
import { getTenantTypeLabel } from '../utils';

type Props = {
    type: TENANT_TYPE;
};

function TenantTag({ type }: Props) {
    const messages = useTranslations();
    const label = getTenantTypeLabel(type, messages);

    let color = '';

    switch (type) {
        case TENANT_TYPE.LABEL:
            color = 'purple';
            break;
        case TENANT_TYPE.WHITE_LABEL:
            color = 'orange';
            break;
    }

    return <Tag color={color}>{label}</Tag>;
}

export default TenantTag;
