import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import PopoverTags from '@/components/ui/tag/popover-tags';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Tag, Tooltip, Typography } from 'antd';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    getDistributionJobStatusColor,
    getDistributionJobTypeColor,
} from '../../helpers';
import { useUpdateDistributionJob } from '../../hooks/use-update-distribution-job';
import {
    DISTRIBUTION_JOB_STATUS,
    DistributionJobData,
    DistributionJobFilter,
} from '../../types';

type Props = Omit<AppProTableProps<DistributionJobData>, 'columns'> & {
    dataFilter: DistributionJobFilter;
    onChangeFilter: OnChangeFilter<DistributionJobFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function DistributionJobsTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const { updateDistributionJob } = useUpdateDistributionJob();

    const renderText = (value?: string | null, copyable = false) => {
        if (!value) return '-';

        return (
            <Typography.Text
                copyable={copyable ? { tooltips: false } : false}
                ellipsis={{ tooltip: value }}
                className="!block max-w-full"
                style={{ maxWidth: '100%' }}
            >
                {value}
            </Typography.Text>
        );
    };

    const getStatusLabel = (status?: string | null) => {
        if (!status) return '-';
        return messages(`distributionJobs.statusOptions.${status}` as any);
    };
    const getTypeLabel = (type?: string | null) => {
        if (!type) return '-';
        return messages(
            `distributionJobs.typeOptions.${type.toUpperCase()}` as any
        );
    };

    const columns: ProColumns<DistributionJobData>[] = [
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
            title: messages('distributionJobs.columns.upc'),
            dataIndex: 'job.upc',
            key: 'job.upc',
            width: 150,
            fixed: 'left',
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'job.upc'
            ),
            render: (_, record) => renderText(record.upc, true),
        },
        {
            title: messages('distributionJobs.columns.type'),
            dataIndex: 'job.type',
            key: 'job.type',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'job.type'
            ),
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
            title: messages('distributionJobs.columns.stepLabel'),
            dataIndex: 'stepLabel',
            key: 'stepLabel',
            width: 220,
            render: (_, record) => renderText(record.stepLabel),
        },
        {
            title: messages('distributionJobs.columns.dspCiCodes'),
            dataIndex: 'dspCiCodes',
            key: 'dspCiCodes',
            width: 160,
            render: (_, record) => {
                if (!record?.dspCiCodes?.length) return '-';

                return (
                    <PopoverTags
                        tags={record?.dspCiCodes || []}
                        maxVisibleTags={2}
                    />
                );
            },
        },
        {
            title: messages('distributionJobs.columns.status'),
            dataIndex: 'job.status',
            key: 'job.status',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'job.status'
            ),
            render: (_, record) =>
                record.status ? (
                    <Tag color={getDistributionJobStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('distributionJobs.columns.deliveryEmail'),
            dataIndex: 'deliveryEmail',
            key: 'deliveryEmail',
            width: 220,
            render: (_, record) => renderText(record?.deliveryEmail, true),
        },
        {
            title: messages('distributionJobs.columns.deliveryEmailSubject'),
            dataIndex: 'deliveryEmailSubject',
            key: 'deliveryEmailSubject',
            width: 220,
            render: (_, record) =>
                renderText(record?.deliveryEmailSubject, true),
        },
        {
            title: messages('distributionJobs.columns.sentAt'),
            dataIndex: 'sentAt',
            key: 'sentAt',
            width: 160,
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
            render: (_, record) => {
                if (record.status !== DISTRIBUTION_JOB_STATUS.PENDING)
                    return null;

                return (
                    <Tooltip title={messages('common.cancel')}>
                        <Button
                            type="text"
                            danger
                            icon={<X size={SIZE_ICON} />}
                            onClick={() => {
                                Modal.confirm({
                                    title: messages(
                                        'distributionJobs.cancelConfirmTitle'
                                    ),
                                    content: messages(
                                        'distributionJobs.cancelConfirmMessage'
                                    ),
                                    okText: messages('common.yes'),
                                    cancelText: messages('common.no'),
                                    onOk: () => {
                                        updateDistributionJob({
                                            id: record.id,
                                            status: DISTRIBUTION_JOB_STATUS.SKIPPED,
                                        });
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    return <AppProTable {...props} columns={columns} pagination={false} />;
}
