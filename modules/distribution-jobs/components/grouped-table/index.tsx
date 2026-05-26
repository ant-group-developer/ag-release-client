import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popover, Tag, Tooltip, Typography } from 'antd';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DISTRIBUTION_JOB } from '../../constants/modal';
import {
    getDistributionJobStatusColor,
    getDistributionJobTypeColor,
} from '../../helpers';
import { DistributionJobFilter, DistributionJobGroupedData } from '../../types';

type Props = Omit<AppProTableProps<DistributionJobGroupedData>, 'columns'> & {
    dataFilter: DistributionJobFilter;
    onChangeFilter: OnChangeFilter<DistributionJobFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function DistributionJobsGroupedTable({
    dataFilter,
    onChangeFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const getTypeLabel = (type?: string | null) => {
        if (!type) return '-';
        return messages(
            `distributionJobs.typeOptions.${type.toUpperCase()}` as any
        );
    };

    const getStatusLabel = (status?: string | null) => {
        if (!status) return '-';
        return messages(`distributionJobs.statusOptions.${status}` as any);
    };

    const columns: ProColumns<DistributionJobGroupedData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('common.date'),
            dataIndex: 'dateGroup',
            key: 'dateGroup',
            width: 160,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'dateGroup'
            // ),
            render: (_, record) =>
                formattedDate(record.dateGroup, DATE_FORMAT.DATE_ONLY),
        },
        {
            title: messages('distributionJobs.columns.upcs'),
            key: 'upcs',
            width: 180,
            render: (_, record) => {
                const upcs = Array.from(
                    new Set(record.upcs?.map((item) => item).filter(Boolean))
                );

                if (upcs.length === 0) return '-';

                if (upcs.length === 1) {
                    return (
                        <Typography.Text copyable={{ tooltips: false }}>
                            {upcs[0]}
                        </Typography.Text>
                    );
                }

                return (
                    <span className="flex items-center gap-1">
                        <Typography.Text
                            copyable={{ text: upcs[0], tooltips: false }}
                        >
                            {upcs[0]}
                        </Typography.Text>
                        <Popover
                            content={
                                <div className="flex max-h-60 flex-col gap-1 overflow-y-auto p-1">
                                    {upcs.slice(1).map((upc) => (
                                        <Typography.Text
                                            key={upc}
                                            copyable={{ tooltips: false }}
                                        >
                                            {upc}
                                        </Typography.Text>
                                    ))}
                                </div>
                            }
                            trigger="hover"
                            placement="topLeft"
                        >
                            <Tag className="!mr-0 ml-1 cursor-pointer">
                                +{upcs.length - 1}
                            </Tag>
                        </Popover>
                    </span>
                );
            },
        },
        {
            title: messages('distributionJobs.columns.type'),
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (_, record) =>
                record.type ? (
                    <Tag color={getDistributionJobTypeColor(record.type)}>
                        {getTypeLabel(record.type)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('distributionJobs.columns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 180,
            render: (_, record) => {
                const statuses = Array.from(
                    new Set(record.status?.filter(Boolean))
                );

                if (!statuses || statuses.length === 0) return '-';

                if (statuses.length === 1) {
                    return (
                        <Tag color={getDistributionJobStatusColor(statuses[0])}>
                            {getStatusLabel(statuses[0])}
                        </Tag>
                    );
                }

                return (
                    <span className="flex items-center gap-1">
                        <Tag color={getDistributionJobStatusColor(statuses[0])}>
                            {getStatusLabel(statuses[0])}
                        </Tag>
                        <Popover
                            content={
                                <div className="flex max-h-60 flex-col gap-1 overflow-y-auto p-1">
                                    {statuses.slice(1).map((status) => (
                                        <Tag
                                            key={status}
                                            color={getDistributionJobStatusColor(
                                                status
                                            )}
                                        >
                                            {getStatusLabel(status)}
                                        </Tag>
                                    ))}
                                </div>
                            }
                            trigger="hover"
                            placement="topLeft"
                        >
                            <Tag className="!mr-0 ml-1 cursor-pointer">
                                +{statuses.length - 1}
                            </Tag>
                        </Popover>
                    </span>
                );
            },
        },
        {
            title: messages('distributionJobs.columns.recipients'),
            dataIndex: 'deliveryEmail',
            key: 'deliveryEmail',
            width: 200,
            render: (_, record) => {
                if (!record?.deliveryEmail) return '-';
                return (
                    <Typography.Text ellipsis copyable={{ tooltips: true }}>
                        {record?.deliveryEmail}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('distributionJobs.columns.deliveryEmailSubject'),
            dataIndex: 'deliveryEmailSubject',
            key: 'deliveryEmailSubject',
            width: 220,
            render: (_, record) => {
                if (!record?.deliveryEmailSubject) return '-';
                return (
                    <Typography.Text
                        ellipsis
                        copyable={{ tooltips: true }}
                        title={record?.deliveryEmailSubject}
                    >
                        {record?.deliveryEmailSubject}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('distributionJobs.columns.sentAt'),
            dataIndex: 'sentAt',
            key: 'sentAt',
            width: 160,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'sentAt'
            // ),
            render: (_, record) =>
                record.sentAt
                    ? formattedDate(record.sentAt, DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
        {
            title: '',
            key: 'actions',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Tooltip title={messages('common.detail')}>
                    <Button
                        type="text"
                        icon={<Eye size={SIZE_ICON} />}
                        onClick={() =>
                            openModal(
                                TYPE_MODAL_DISTRIBUTION_JOB.DETAIL,
                                record
                            )
                        }
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            columns={columns}
            pagination={false}
            rowKey={(record) =>
                `${record.dateGroup}-${record.type}-${record.deliveryEmailSubject}`
            }
        />
    );
}
