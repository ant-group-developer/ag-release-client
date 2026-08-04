import IconButton from '@/components/ui/button/icon-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { SIZE_ICON } from '@/constants/common';
import { getIndex } from '@/helpers/common';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { ProColumns } from '@ant-design/pro-components';
import { Popconfirm, Tag, theme } from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAssignDspReport } from '../../hooks/use-assign-dsp-report';
import { useDeleteDspReport } from '../../hooks/use-delete-dsp-report';
import { useUnassignDspReport } from '../../hooks/use-unassign-dsp-report';
import { DspReportData } from '../../types';
import PgDspsSyncSelect from '../select/pg-dsps-sync-select';
import { FtpParserConfigList } from './ftp-parser-config-list';

type Props = Omit<AppProTableProps<DspReportData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const DspReportTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { assignDspReport, isPending: isAssigning } = useAssignDspReport();
    const { unassignDspReport, isPending: isUnassigning } =
        useUnassignDspReport();
    const { deleteDspReport, isPending: isDeleting } = useDeleteDspReport();

    const columns: ProColumns<DspReportData>[] = [
        {
            title: messages('dspReport.table.no'),
            key: 'iNo',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('dspReport.table.reportName'),
            key: 'dspName',
            dataIndex: 'dspName',
            width: 240,
            fixed: 'left',
            ellipsis: true,
            render: (_, record) => (
                <span title={record.dspName} className="truncate">
                    {record.dspName}
                </span>
            ),
        },
        {
            title: messages('dspReport.table.source'),
            key: 'source',
            dataIndex: 'source',
            width: 100,
            render: (_, record) => <Tag>{record.source}</Tag>,
        },
        // {
        //     title: messages('dspReport.table.dsp'),
        //     key: 'dspCode',
        //     dataIndex: ['pgDspsSync', 'dspCode'],
        //    width: 220,
        //     render: (_, record) => {
        //         if (!record.pgDspsSync) return '-';
        //         return (
        //             <Space>
        //                 <Avatar src={record.pgDspsSync.picture} size="small" />
        //                 <span>{record.pgDspsSync.dspName}</span>
        //             </Space>
        //         );
        //     },
        // },
        {
            title: messages('dspReport.table.ciCode'),
            key: 'dspCiCode',
            dataIndex: ['pgDspsSync', 'dspCiCode'],
            width: 160,
            render: (_, record) => record.pgDspsSync?.dspCiCode || '-',
        },
        {
            title: messages('dspReport.table.pendingReleasesCount'),
            key: 'pendingReleasesCount',
            dataIndex: 'pendingReleasesCount',
            width: 180,
            render: (_, record) => record.pendingReleasesCount ?? '-',
        },
        {
            title: messages('dspReport.table.assign'),
            key: 'assign',
            width: 260,
            render: (_, record) => (
                <PgDspsSyncSelect
                    allowClear
                    className="w-full"
                    defaultValue={record.pgUuid}
                    disabled={isAssigning || isUnassigning || isDeleting}
                    onChange={(value) => {
                        if (value) {
                            assignDspReport({
                                id: record.idDspsReport,
                                payload: { pgUuid: value },
                            });
                        } else {
                            unassignDspReport({
                                id: record.idDspsReport,
                            });
                        }
                    }}
                />
            ),
        },
        {
            title: messages('common.action'),
            key: 'action',
            width: 80,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <PermissionGate adminOnly>
                    <Popconfirm
                        title={messages('delete.confirmTitle')}
                        description={messages('delete.confirmMessage', {
                            value: record.dspName,
                        })}
                        okText={messages('common.delete')}
                        cancelText={messages('common.cancel')}
                        okButtonProps={{ loading: isDeleting, danger: true }}
                        onConfirm={() =>
                            deleteDspReport({
                                id: record.idDspsReport,
                            })
                        }
                    >
                        <IconButton>
                            <Trash
                                size={SIZE_ICON}
                                className="text-red-500 hover:text-red-700"
                            />
                        </IconButton>
                    </Popconfirm>
                </PermissionGate>
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            pagination={false}
            columns={columns}
            rowKey="idDspsReport"
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            expandable={{
                expandedRowRender: (record) => (
                    <FtpParserConfigList
                        dspReportId={record.idDspsReport}
                        dspName={record?.dspName}
                    />
                ),
            }}
        />
    );
};
