import JsonViewer from '@/components/ui/json-viewer';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate } from '@/helpers/common';
import { isValidJSON } from '@/helpers/string';
import { Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import copy from 'copy-to-clipboard';
import { useTranslations } from 'next-intl';
import { METHOD } from '../enums';
import { LogData } from '../types/data';

// const ReactJson = dynamic(import('react-json-view'), { ssr: false });

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<AppTableProps<LogData>, 'columns'>;

function LogTable({ ...props }: Props) {
    const messages = useTranslations();

    const columns: ColumnsType<LogData> = [
        // {
        //     dataIndex: '',
        //     title: messages('common.no.'),
        //     align: 'center',
        //     width: 60,
        //     render: (text, record, index) =>
        //         getIndex(
        //             props.pagination.pageSize,
        //             props.pagination.current,
        //             index
        //         ),
        // },
        {
            title: messages('common.method'),
            dataIndex: 'action',
            width: 100,
            align: 'center',
            ellipsis: true,
            render: (cell) => {
                let color;
                if (cell === METHOD.GET) color = 'green';
                if (cell === METHOD.POST) color = 'orange';
                if (cell === METHOD.PUT) color = 'blue';
                if (cell === METHOD.PATCH) color = 'purple';
                if (cell === METHOD.DELETE) color = 'red';

                if (color) {
                    return (
                        <Tag color={color} className="text-sm">
                            {cell}
                        </Tag>
                    );
                }

                return cell;
            },
        },
        {
            title: messages('common.email'),
            dataIndex: 'email',
            width: 180,
            ellipsis: true,
            onCell: (data) => ({
                onClick: () => copy(data.email ?? ''),
                className: 'cursor-copy',
            }),
            render: (cell) => (
                <Tooltip title={messages('common.copied')} trigger={'click'}>
                    {cell}
                </Tooltip>
            ),
        },
        {
            title: 'User ID',
            dataIndex: 'creatorId',
            width: 130,
            ellipsis: true,
            onCell: (data) => ({
                onClick: () => copy(data.creatorId ?? ''),
                className: 'cursor-copy',
            }),
            render: (cell) => (
                <Tooltip title={messages('common.copied')} trigger={'click'}>
                    {cell}
                </Tooltip>
            ),
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            width: 120,
            ellipsis: true,
            onCell: (data) => ({
                onClick: () => copy(data.ip ?? ''),
                className: 'cursor-copy',
            }),
            render: (cell) => (
                <Tooltip title={messages('common.copied')} trigger={'click'}>
                    {cell}
                </Tooltip>
            ),
        },
        {
            title: messages('country.label'),
            dataIndex: 'country',
            width: 100,
            ellipsis: true,
        },
        {
            title: messages('country.city'),
            dataIndex: 'city',
            width: 100,
            ellipsis: true,
        },
        {
            title: 'API',
            dataIndex: 'originalUrl',
            width: 180,
            ellipsis: true,
            onCell: (data) => ({
                onClick: () => copy(data.originalUrl ?? ''),
                className: 'cursor-copy',
            }),
            render: (cell) => (
                <Tooltip title={messages('common.copied')} trigger={'click'}>
                    {cell}
                </Tooltip>
            ),
        },
        {
            title: 'Code',
            dataIndex: 'statusCode',
            width: 60,
            align: 'center',
            ellipsis: true,
            render: (cell, record) => {
                if (!cell) return;
                return (
                    <Tag
                        className="text-sm"
                        color={record.success ? 'green' : 'red'}
                        // bordered={false}
                    >
                        {cell}
                    </Tag>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'dateCreated',
            align: 'center',
            width: 150,
            render: (cell) => formattedDate(cell),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={columns}
            expandable={{
                expandedRowRender: ({ content, response, userAgent, note }) => (
                    <div className="grid grid-cols-1 gap-5 px-4 py-2 md:grid-cols-2 lg:grid-cols-8">
                        {content && (
                            <div className="lg:col-span-3">
                                <h3 className="mb-1 font-semibold">Content</h3>
                                <JsonViewer src={JSON.parse(content)} />
                            </div>
                        )}

                        {response && isValidJSON(response) && (
                            <div className="lg:col-span-3">
                                <h3 className="mb-1 font-semibold">Response</h3>
                                <JsonViewer src={JSON.parse(response)} />
                            </div>
                        )}

                        {(userAgent || note) && (
                            <div className="lg:col-span-2">
                                <div className="mb-2">
                                    <h3 className="mb-1 font-semibold">
                                        User agent
                                    </h3>
                                    <p className="text-wrap">{userAgent}</p>
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold">
                                        {messages('common.note')}
                                    </h3>
                                    <p className="text-wrap">{note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ),
                rowExpandable: ({ content, response }) =>
                    !!content || !!response,
            }}
        />
    );
}

export default LogTable;
