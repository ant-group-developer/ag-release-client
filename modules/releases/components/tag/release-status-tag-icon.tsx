import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DiffOutlined,
    SendOutlined,
    StopOutlined,
    SyncOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASES_STATUS } from '../../enums';

type Props = TagProps & {
    status: RELEASES_STATUS;
};

export default function ReleaseStatusTagIcon({ status, ...props }: Props) {
    const messages = useTranslations();

    const config = useMemo(() => {
        switch (status) {
            case RELEASES_STATUS.DRAFT:
                return { color: 'default', icon: <DiffOutlined /> };
            case RELEASES_STATUS.PROCESSING:
                return { color: 'blue', icon: <SyncOutlined /> };
            case RELEASES_STATUS.SUBMITTED:
                return { color: 'green', icon: <SendOutlined /> };
            case RELEASES_STATUS.AWAITING_ACTION:
                return { color: 'orange', icon: <ClockCircleOutlined /> };
            case RELEASES_STATUS.FAILED:
                return { color: 'red', icon: <CloseCircleOutlined /> };
            case RELEASES_STATUS.TAKEN_DOWN:
                return { color: 'gold', icon: <StopOutlined /> };
            case RELEASES_STATUS.DISTRIBUTED:
                return { color: 'green', icon: <CheckCircleOutlined /> };
            case RELEASES_STATUS.PARTIALLY_FAILED:
                return { color: 'volcano', icon: <WarningOutlined /> };
            case RELEASES_STATUS.UNRELEASED:
                return { color: 'blue', icon: <StopOutlined /> };
            default:
                return { color: 'default', icon: null };
        }
    }, [status]);

    if (!status || !config) return null;

    return (
        <Tag color={config.color} icon={config.icon} {...props}>
            {messages(`release.statusV2.${status}`)}
        </Tag>
    );
}
