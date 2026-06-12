import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_FTP_EXCLUDE_PATTERN } from '../../enums';
import {
    FtpExcludePatternData,
    FtpExcludePatternDataFilter,
} from '../../types';

type Props = Omit<AppTableProps<FtpExcludePatternData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: FtpExcludePatternDataFilter;
};

export default function FtpExcludePatternTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    void dataFilter;

    const columns: ColumnType<FtpExcludePatternData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.pattern'),
            key: 'pattern',
            dataIndex: 'pattern',
            width: 180,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.patternType'),
            key: 'patternType',
            dataIndex: 'patternType',
            width: 100,
            align: 'center',
            render: (value) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.scope'),
            key: 'scope',
            dataIndex: 'scope',
            width: 100,
            align: 'center',
            render: (value) => <Tag color="purple">{value}</Tag>,
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.isActive'),
            key: 'isActive',
            dataIndex: 'isActive',
            width: 100,
            align: 'center',
            render: (value) =>
                value === 1 ? (
                    <Tag color="success">{messages('status.active')}</Tag>
                ) : (
                    <Tag color="error">{messages('status.inActive')}</Tag>
                ),
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.description'),
            key: 'description',
            dataIndex: 'description',
            width: 200,
            ellipsis: true,
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     width: 150,
        //     align: 'center',
        //     render: (value) => formattedDate(value),
        // },
        {
            key: 'actions',
            width: 90,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_FTP_EXCLUDE_PATTERN.UPDATE, record)
                    }
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_FTP_EXCLUDE_PATTERN.DELETE, record)
                    }
                />
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
