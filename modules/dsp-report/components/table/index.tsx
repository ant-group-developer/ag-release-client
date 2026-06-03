import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { getIndex } from '@/helpers/common';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useAssignDspReport } from '../../hooks/use-assign-dsp-report';
import { useUnassignDspReport } from '../../hooks/use-unassign-dsp-report';
import { DspReportData } from '../../types';
import PgDspsSyncSelect from '../select/pg-dsps-sync-select';

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
        //     width: 220,
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
            title: messages('dspReport.table.assign'),
            key: 'assign',
            width: 260,
            render: (_, record) => (
                <PgDspsSyncSelect
                    allowClear
                    className="w-full"
                    defaultValue={record.pgUuid}
                    disabled={isAssigning || isUnassigning}
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
        />
    );
};
