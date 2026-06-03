import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { formattedDate, getIndex } from '@/helpers/common';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import { DspReportData } from '../../types';

type Props = Omit<AppProTableProps<DspReportData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const DspReportTable = ({ ...props }: Props) => {
    const { token } = theme.useToken();

    const columns: ProColumns<DspReportData>[] = [
        {
            title: 'No.',
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
            title: 'DSP name',
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
            title: 'Source',
            key: 'source',
            dataIndex: 'source',
            width: 140,
            render: (_, record) => <Tag>{record.source}</Tag>,
        },
        {
            title: 'PG UUID',
            key: 'pgUuid',
            dataIndex: 'pgUuid',
            width: 140,
            render: (_, record) => (
                <CopyText text={record.pgUuid}>
                    <span className="truncate">{record.pgUuid}</span>
                </CopyText>
            ),
        },
        {
            title: 'DSP code',
            key: 'dspCode',
            dataIndex: ['pgDspsSync', 'dspCode'],
            width: 220,
            render: (_, record) => record.pgDspsSync?.dspCode ?? '-',
        },
        {
            title: 'DSP sync name',
            key: 'pgDspsSyncName',
            dataIndex: ['pgDspsSync', 'dspName'],
            width: 220,
            ellipsis: true,
            render: (_, record) => record.pgDspsSync?.dspName ?? '-',
        },
        {
            title: 'DSP CI code',
            key: 'dspCiCode',
            dataIndex: ['pgDspsSync', 'dspCiCode'],
            width: 160,
            render: (_, record) => record.pgDspsSync?.dspCiCode || '-',
        },
        {
            title: 'Created at',
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 160,
            render: (_, record) => formattedDate(record.createdAt),
        },
        {
            title: 'Updated at',
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 160,
            render: (_, record) => formattedDate(record.updatedAt),
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
