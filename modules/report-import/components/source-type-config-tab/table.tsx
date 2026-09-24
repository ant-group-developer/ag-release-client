import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, Image, Tag, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_SOURCE_TYPE_CONFIG } from '../../enums';
import { SourceTypeConfigData } from '../../types';

type Props = Omit<AppTableProps<SourceTypeConfigData>, 'columns'> & {
    data: SourceTypeConfigData[];
    loading?: boolean;
};

export default function SourceTypeConfigTable({
    data,
    loading,
    ...props
}: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
    const openModal = useModalStore((state) => state.openModal);
    const { isAdmin } = useAuth();

    const columns: ColumnType<SourceTypeConfigData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: isMobile ? undefined : 'left',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('reportConfigs.sourceTypeConfigs.image'),
            key: 'imageUrl',
            dataIndex: 'imageUrl',
            width: 90,
            align: 'center',
            render: (value: string | null, record) =>
                value ? (
                    <Image
                        src={value}
                        alt={record.label}
                        width={36}
                        height={36}
                        className="rounded object-cover"
                        fallback="/images/default-thumbnail.png"
                    />
                ) : (
                    <Avatar shape="square" size={36}>
                        {record.label?.charAt(0)?.toUpperCase() || 'S'}
                    </Avatar>
                ),
        },
        {
            title: messages('reportConfigs.sourceTypeConfigs.sourceType'),
            key: 'sourceType',
            dataIndex: 'sourceType',
            width: 160,
            ellipsis: true,
            render: (value: string) => (
                <Tag color="blue" className="font-mono">
                    {value}
                </Tag>
            ),
        },
        {
            title: messages('reportConfigs.sourceTypeConfigs.nameLabel'),
            key: 'label',
            dataIndex: 'label',
            width: 180,
            ellipsis: true,
            render: (value: string) => (
                <Typography.Text strong>{value}</Typography.Text>
            ),
        },
        {
            title: messages('reportConfigs.sourceTypeConfigs.isActive'),
            key: 'isActive',
            dataIndex: 'isActive',
            width: 120,
            align: 'center',
            render: (value: boolean) => (
                <Tag color={value ? 'success' : 'default'}>
                    {messages(value ? 'status.active' : 'status.inActive')}
                </Tag>
            ),
        },
        // {
        //     title: messages('reportConfigs.sourceTypeConfigs.configVersion'),
        //     key: 'configVersion',
        //     dataIndex: 'configVersion',
        //     width: 140,
        //     align: 'center',
        //     render: (value: string) => <Tag color="purple">v{value}</Tag>,
        // },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 160,
            align: 'center',
            render: (value: string) => formattedDate(value),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            width: 160,
            align: 'center',
            render: (value: string) => formattedDate(value),
        },
        ...(isAdmin
            ? [
                  {
                      key: 'actions',
                      width: 90,
                      align: 'center' as const,
                      fixed: isMobile ? undefined : ('right' as const),
                      render: (_: any, record: SourceTypeConfigData) => (
                          <ActionButton
                              showUpdate
                              showDelete
                              onShowUpdate={() =>
                                  openModal(
                                      TYPE_MODAL_SOURCE_TYPE_CONFIG.UPDATE,
                                      record
                                  )
                              }
                              onShowDelete={() =>
                                  openModal(
                                      TYPE_MODAL_SOURCE_TYPE_CONFIG.DELETE,
                                      record
                                  )
                              }
                          />
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AppTable
            {...props}
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="sourceType"
            pagination={false}
        />
    );
}
