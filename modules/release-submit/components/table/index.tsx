import IconButton from '@/components/ui/button/icon-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { TYPE_MODAL_RELEASE_EXECUTION } from '@/modules/release-executions/enums';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Space, Tag, theme, Typography } from 'antd';
import { Eye, FileJson } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FieldOrderReleaseExecution3 } from '../../enums';
import {
    formatDurationShort,
    formatEnumLabel,
    formatRelativeShort,
    getReleaseSubmitStatusColor,
    getReleaseSubmitTypeColor,
} from '../../helpers';
import { ReleaseSubmitData, ReleaseSubmitFilter } from '../../types';

type Props = Omit<AppProTableProps<ReleaseSubmitData>, 'columns'> & {
    dataFilter: ReleaseSubmitFilter;
    onChangeFilter: OnChangeFilter<ReleaseSubmitFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
    onViewSnapshot?: (snapshot: any) => void;
    showIsrc?: boolean;
};

export default function ReleaseSubmitTable({ dataFilter, showIsrc = false, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { dspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const { token } = theme.useToken();

    const columns: ProColumns<ReleaseSubmitData>[] = [
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
            title: showIsrc ? messages('common.isrc') : messages('releaseExecution.columns.upc'),
            dataIndex: FieldOrderReleaseExecution3.execution_releaseUpc,
            key: FieldOrderReleaseExecution3.execution_releaseUpc,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                FieldOrderReleaseExecution3.execution_releaseUpc
            ),
            width: 150,
            fixed: 'left',
            render: (_, record) => {
                const releaseSnapshot = record?.metadata?.input?.releaseSnapshot;
                if (showIsrc) {
                    const isrc = releaseSnapshot?.isrc || releaseSnapshot?.video?.isrc;
                    if (!isrc) return '-';
                    return (
                        <Typography.Text copyable>
                            {isrc}
                        </Typography.Text>
                    );
                }
                const upc = record?.metadata?.input?.upcAutoIfReleaseSnapshotNull || releaseSnapshot?.upc;
                if (!upc) return '-';
                return (
                    <Typography.Text copyable>
                        {upc}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('releaseExecution.columns.releaseName'),
            dataIndex: FieldOrderReleaseExecution3.execution_releaseTitle,
            key: FieldOrderReleaseExecution3.execution_releaseTitle,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                FieldOrderReleaseExecution3.execution_releaseTitle
            ),
            width: 250,
            ellipsis: true,
            render: (_, record) => {
                const releaseSnapshot =
                    record?.metadata?.input?.releaseSnapshot;
                const coverArts = (releaseSnapshot as any)?.releaseCoverArts as
                    | { type: string; fileId: string }[]
                    | undefined;
                const coverArtFileId =
                    coverArts?.find((art) => art.type === '75x75')?.fileId ??
                    coverArts?.[0]?.fileId;
                return (
                    <Space>
                        {coverArtFileId ? (
                            <div style={{ flexShrink: 0 }}>
                                <ReleaseCoverImage
                                    fileId={coverArtFileId}
                                    width={36}
                                    height={36}
                                />
                            </div>
                        ) : (
                            <Avatar shape="square" size={36}>
                                -
                            </Avatar>
                        )}
                        <Typography.Text copyable ellipsis>
                            {releaseSnapshot?.title || '-'}
                        </Typography.Text>
                    </Space>
                );
            },
        },
        {
            title: messages('releaseExecution.columns.type'),
            dataIndex: FieldOrderReleaseExecution3.execution_type,
            key: FieldOrderReleaseExecution3.execution_type,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                FieldOrderReleaseExecution3.execution_type
            ),
            width: 120,
            render: (_, record) =>
                record.type ? (
                    <Tag color={getReleaseSubmitTypeColor(record.type)}>
                        {formatEnumLabel(record.type)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('releaseExecution.columns.status'),
            dataIndex: FieldOrderReleaseExecution3.execution_status,
            key: FieldOrderReleaseExecution3.execution_status,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                FieldOrderReleaseExecution3.execution_status
            ),
            width: 130,
            render: (_, record) =>
                record.status ? (
                    <Tag color={getReleaseSubmitStatusColor(record.status)}>
                        {formatEnumLabel(record.status)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: 'DSPs',
            key: 'dspCodes',
            width: 200,
            render: (_, record) => {
                const dspCodes = record?.metadata?.input?.dspCodes;
                if (!dspCodes || !dspCodes.length) return '-';

                const sortedDspCodes = [...dspCodes].sort((a, b) =>
                    a.localeCompare(b)
                );

                return (
                    <Avatar.Group
                        max={{
                            count: 8,
                            popover: { trigger: 'hover' },
                            style: {
                                color: token.colorText,
                                backgroundColor: token.colorBgLayout,
                                cursor: 'pointer',
                            },
                        }}
                        size="small"
                    >
                        {sortedDspCodes.map((code) => {
                            const dsp = dspData?.items?.find(
                                (d) => d.code === code
                            );
                            return (
                                <CustomTooltip
                                    key={code}
                                    title={dsp?.name || code}
                                >
                                    <Avatar
                                        src={dsp?.picture}
                                        size="small"
                                        style={{
                                            backgroundColor: '#ccc',
                                        }}
                                    >
                                        {(dsp?.name || code)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar>
                                </CustomTooltip>
                            );
                        })}
                    </Avatar.Group>
                );
            },
        },
        {
            title: messages('releaseExecution.columns.since'),
            key: 'since',
            width: 150,
            render: (_, record) => {
                const sinceText =
                    formatRelativeShort(record?.completedAt, messages) ??
                    formatRelativeShort(record?.createdAt, messages);
                const completedText = formatDurationShort(
                    record?.createdAt,
                    record?.completedAt,
                    messages('releaseExecution.detail.columns.completedIn')
                );

                if (!sinceText && !completedText && !record?.summary)
                    return '-';

                const tooltipTitle = (
                    <div>
                        <p>
                            {messages('common.startedAt')}:{' '}
                            {formattedDate(record?.createdAt)}
                        </p>
                        {record?.completedAt && (
                            <p>
                                {messages('common.completedAt')}:{' '}
                                {formattedDate(record?.completedAt)}
                            </p>
                        )}
                    </div>
                );

                return (
                    <CustomTooltip title={tooltipTitle}>
                        <div className="min-w-0">
                            {sinceText && (
                                <div className="text-blue-500">
                                    {messages('common.startedAt')} {sinceText}
                                </div>
                            )}
                            {completedText && (
                                <Typography.Text
                                    type="secondary"
                                    className="!text-xs"
                                >
                                    {completedText}
                                </Typography.Text>
                            )}
                        </div>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: FieldOrderReleaseExecution3.execution_createdAt,
            key: FieldOrderReleaseExecution3.execution_createdAt,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                FieldOrderReleaseExecution3.execution_createdAt
            ),
            width: 150,
            render: (value, record) =>
                record?.createdAt
                    ? formattedDate(record?.createdAt, DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
        {
            title: '',
            key: 'actions',
            width: 80,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space>
                    {record?.metadata?.input?.releaseSnapshot && (
                        <CustomTooltip
                            title={messages('releaseExecution.releaseSnapshot')}
                        >
                            <IconButton
                                onClick={() => {
                                    props.onViewSnapshot?.(record);
                                }}
                            >
                                <FileJson size={SIZE_ICON} />
                            </IconButton>
                        </CustomTooltip>
                    )}
                    <CustomTooltip title={messages('common.viewDetail')}>
                        <IconButton
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_RELEASE_EXECUTION.DETAIL,
                                    record
                                )
                            }
                        >
                            <Eye size={SIZE_ICON} />
                        </IconButton>
                    </CustomTooltip>
                </Space>
            ),
        },
    ];

    return <AppProTable {...props} columns={columns} pagination={false} />;
}
