import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { Switch, Tag, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_FTP_PROVIDER_CONFIG } from '../../enums';
import { useUpdateFtpProviderConfig } from '../../hooks/use-update';
import {
    FtpProviderConfigData,
    FtpProviderConfigDataFilter,
} from '../../types';

type Props = Omit<AppTableProps<FtpProviderConfigData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: FtpProviderConfigDataFilter;
};

export default function FtpProviderConfigTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
    const openModal = useModalStore((state) => state.openModal);
    const { updateFtpProviderConfig } = useUpdateFtpProviderConfig();
    void dataFilter;

    const columns: ColumnType<FtpProviderConfigData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: isMobile ? undefined : 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.name'),
            key: 'name',
            dataIndex: 'name',
            width: 180,
            fixed: isMobile ? undefined : 'left',
            ellipsis: true,
            render: (value) => (
                <Typography.Text strong>{value}</Typography.Text>
            ),
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.code'),
            key: 'code',
            dataIndex: 'code',
            width: 140,
            ellipsis: true,
            render: (value) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.host'),
            key: 'host',
            dataIndex: 'host',
            width: 220,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.port'),
            key: 'port',
            dataIndex: 'port',
            width: 90,
            align: 'center',
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.username'),
            key: 'username',
            dataIndex: 'username',
            width: 200,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.secure'),
            key: 'secure',
            dataIndex: 'secure',
            width: 110,
            align: 'center',
            render: (value) => {
                const strVal = String(value);
                const color =
                    strVal === 'true' || strVal === 'explicit' || strVal === 'implicit'
                        ? 'green'
                        : 'default';
                return <Tag color={color}>{strVal}</Tag>;
            },
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.basePath'),
            key: 'basePath',
            dataIndex: 'basePath',
            width: 140,
            ellipsis: true,
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            width: 100,
            align: 'center',
            render: (value, record) => (
                <Switch
                    checked={Boolean(value)}
                    checkedChildren={messages('status.active')}
                    unCheckedChildren={messages('status.inActive')}
                    onChange={(checked) =>
                        updateFtpProviderConfig({
                            id: record.id,
                            payload: { isActive: checked },
                        })
                    }
                />
            ),
        },
        {
            title: messages('reportConfigs.ftpProviderConfig.description'),
            key: 'description',
            dataIndex: 'description',
            width: 220,
            ellipsis: true,
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-2 truncate whitespace-pre-line">
                        {value || '-'}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        {
            key: 'actions',
            width: 90,
            align: 'center',
            fixed: isMobile ? undefined : 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() =>
                        openModal(
                            TYPE_MODAL_FTP_PROVIDER_CONFIG.UPDATE,
                            record
                        )
                    }
                    onShowDelete={() =>
                        openModal(
                            TYPE_MODAL_FTP_PROVIDER_CONFIG.DELETE,
                            record
                        )
                    }
                />
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
