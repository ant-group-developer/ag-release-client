import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { ProColumns } from '@ant-design/pro-components';
import {
    Avatar,
    Button,
    Modal,
    Popover,
    Tag,
    theme,
    Tooltip,
    Typography,
} from 'antd';
import { Eye, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    getDistributionJobStatusColor,
    getDistributionJobTypeColor,
} from '../../helpers';
import { useUpdateDistributionJob } from '../../hooks/use-update-distribution-job';
import { DISTRIBUTION_JOB_STATUS, DistributionJobData } from '../../types';

type Props = Omit<AppProTableProps<DistributionJobData>, 'columns'>;

export default function DistributionJobsTable(props: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { updateDistributionJob } = useUpdateDistributionJob();
    const { dspData } = useGetListDsp({
        page: 1,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const dspList = dspData?.items;

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
                // getIndex(
                //     props?.pagination?.pageSize,
                //     props?.pagination?.current,
                //     index
                // ),
                index + 1,
        },
        {
            title: messages('distributionJobs.columns.upc'),
            dataIndex: 'upc',
            key: 'upc',
            width: 180,
            fixed: 'left',
            sorter: (a, b) => (a.upc || '').localeCompare(b.upc || ''),
            render: (_, record) => renderText(record.upc, true),
        },
        {
            title: messages('distributionJobs.columns.type'),
            dataIndex: 'type',
            key: 'type',
            width: 160,
            sorter: (a, b) => (a.type || '').localeCompare(b.type || ''),
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
            ellipsis: true,
            width: 220,
            render: (_, record) => renderText(record.stepLabel),
        },
        {
            title: 'DSPs',
            dataIndex: 'dspCiCodes',
            key: 'dspCiCodes',
            width: 230,
            render: (_, record) => {
                if (!record?.dspCodes?.length) return '-';

                return (
                    <Avatar.Group
                        max={{
                            count: 8,
                            style: {
                                backgroundColor: '#ccc',
                            },
                        }}
                        size={'small'}
                    >
                        {[...record.dspCodes]
                            .sort((a, b) => a.localeCompare(b))
                            .map((dspCodes) => {
                                const dsp = dspList?.find(
                                    (dsp) => dsp.codeCi === dspCodes
                                );
                                return (
                                    <CustomTooltip
                                        key={dspCodes}
                                        title={dsp?.name}
                                    >
                                        <Avatar
                                            src={dsp?.picture}
                                            size="small"
                                            style={{
                                                backgroundColor: '#ccc',
                                            }}
                                        >
                                            {dspCodes?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </CustomTooltip>
                                );
                            })}
                    </Avatar.Group>
                );
            },
        },
        {
            title: messages('distributionJobs.columns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
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
            title: messages('distributionJobs.columns.recipients'),
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
            title: messages('common.note'),
            dataIndex: 'notes',
            key: 'notes',
            width: 200,
            render: (_, record) => {
                const notes = record.notes;
                if (!notes) return '-';

                const isLong = notes.length > 30;

                return (
                    <div className="flex items-center gap-1">
                        <Typography.Paragraph
                            className="!mb-0 whitespace-pre-line"
                            style={{
                                maxWidth: isLong ? 'calc(100% - 24px)' : '100%',
                            }}
                            ellipsis={isLong ? { tooltip: false } : false}
                        >
                            {notes}
                        </Typography.Paragraph>
                        {isLong && (
                            <Popover
                                content={
                                    <div className="max-h-60 max-w-xs overflow-y-auto whitespace-pre-wrap">
                                        {notes}
                                    </div>
                                }
                                trigger="hover"
                            >
                                <Eye
                                    size={16}
                                    className="shrink-0 cursor-pointer text-gray-500"
                                />
                            </Popover>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (_, record) =>
                record.createdAt
                    ? formattedDate(record.createdAt, DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
        {
            title: messages('common.sentAt'),
            dataIndex: 'sentAt',
            key: 'sentAt',
            width: 160,
            fixed: 'right',
            render: (_, record) =>
                record.sentAt
                    ? formattedDate(record.sentAt, DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
        {
            title: '',
            key: 'actions',
            width: 50,
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

    return (
        <AppProTable
            {...props}
            columns={columns}
            pagination={props.pagination ?? false}
        />
    );
}
