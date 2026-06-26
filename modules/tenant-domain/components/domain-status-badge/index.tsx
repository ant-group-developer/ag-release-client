'use client';

import { Badge, BadgeProps } from 'antd';
import { useTranslations } from 'next-intl';
import { DOMAIN_STATUS } from '../../enums';

const STATUS_MAP: Record<DOMAIN_STATUS, BadgeProps['status']> = {
    [DOMAIN_STATUS.ACTIVE]: 'success',
    [DOMAIN_STATUS.VERIFYING]: 'processing',
    [DOMAIN_STATUS.PENDING]: 'warning',
    [DOMAIN_STATUS.FAILED]: 'error',
    [DOMAIN_STATUS.EXPIRED]: 'default',
};

interface Props {
    status: DOMAIN_STATUS;
}

function DomainStatusBadge({ status }: Props) {
    const t = useTranslations('tenantDomain');

    return (
        <Badge status={STATUS_MAP[status]} text={t(`status.${status}`)} />
    );
}

export default DomainStatusBadge;
