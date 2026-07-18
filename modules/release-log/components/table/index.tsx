import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Card, Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';

import JsonViewer from '@/components/ui/json-viewer';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { RELEASE_LOG_STATUS } from '../../enums';
import { ReleaseLogData, ReleaseLogFilter } from '../../types';

type Props = Omit<AppProTableProps<ReleaseLogData>, 'columns'> & {
    dataFilter: ReleaseLogFilter;
    onChangeFilter: OnChangeFilter<ReleaseLogFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseLogTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();

    const { token } = theme.useToken();

    const column: ProColumns<ReleaseLogData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => {
                return (
                    <div data-stop-row-click="true">
                        {getIndex(
                            props?.pagination?.pageSize,
                            props?.pagination?.current,
                            index
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: 'title',
            align: 'left',
            width: 200,
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 flex-shrink-0">
                            <ReleaseCoverImage data={record?.release} />
                        </div>
                        <span className="truncate break-words">
                            {record?.release?.title}
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('dsp.label'),
            key: 'dsp',
            dataIndex: 'dsp',
            align: 'left',
            width: 120,
            render: (value, record) => {
                if (!record?.dsp) return '-';
                return (
                    <div className="flex min-w-0 items-center gap-2">
                        <Avatar
                            className="flex-shrink-0"
                            size={'small'}
                            src={record?.dsp?.picture}
                        />
                        <span title={record?.dsp?.name} className="truncate">
                            {record?.dsp?.name}
                        </span>
                    </div>
                );
            },
        },
        // {
        //     title: messages('releaseLog.statusRelease'),
        //     key: 'releaseStatus',
        //     dataIndex: 'releaseStatus',
        //     align: 'left',
        //     width: 120,
        //     render: (value, record) => {
        //         return <ReleaseStatusTag status={record?.release?.status} />;
        //     },
        // },
        {
            title: messages('releaseLog.statusLog'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value, record) => {
                const color =
                    record?.status === RELEASE_LOG_STATUS.FAILED
                        ? 'error'
                        : record?.status === RELEASE_LOG_STATUS.SUCCESS
                          ? 'success'
                          : 'processing';
                return (
                    <Tag className="capitalize" color={color}>
                        {record?.status?.toLowerCase()}
                    </Tag>
                );
            },
        },
        {
            title: messages('common.step'),
            key: 'step',
            dataIndex: 'step',
            align: 'left',
            width: 150,
            render: (value, record) => {
                return <span>{record?.step}</span>;
            },
        },
        {
            title: messages('releaseLog.label'),
            key: 'releaseLog',
            dataIndex: 'releaseLog',
            align: 'left',
            width: 300,
            render: (value, record) => {
                if (!record?.logs) return '-';
                const logText =
                    typeof record.logs === 'string'
                        ? record.logs
                        : JSON.stringify(record.logs);
                return (
                    <span
                        className="line-clamp-6 whitespace-pre-wrap text-wrap"
                        title={logText}
                    >
                        {logText}
                    </span>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'log.createdAt',
            dataIndex: 'log.createdAt',
            align: 'left',
            width: 130,
            sorter: true,
            defaultSortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'log.createdAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.createdAt, DATE_FORMAT.DATE_MINUTE)}
                </span>
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            pagination={false}
            columns={column}
            expandable={{
                columnWidth: 20,
                expandRowByClick: true,
                expandIcon: ({ expanded, onExpand, record }) =>
                    record.content ? (
                        <div
                            onClick={(e) => {
                                onExpand(record, e);
                                e.stopPropagation();
                            }}
                            className="flex cursor-pointer items-center justify-center p-1 text-slate-400 hover:text-slate-600"
                        >
                            {expanded ? (
                                <CaretDownOutlined className="text-[12px]" />
                            ) : (
                                <CaretRightOutlined className="text-[12px]" />
                            )}
                        </div>
                    ) : null,
                expandedRowRender: (record) => {
                    let jsonContent = null;
                    if (
                        typeof record.content === 'object' &&
                        record.content !== null
                    ) {
                        jsonContent = record.content;
                    } else if (typeof record.content === 'string') {
                        try {
                            jsonContent = JSON.parse(record.content);
                        } catch (e) {
                            // Not a JSON string
                        }
                    }

                    return (
                        <div
                            style={{
                                padding: '8px 24px',
                                background: '#fafafa',
                            }}
                        >
                            {jsonContent ? (
                                <Card
                                    size="small"
                                    styles={{
                                        body: {
                                            maxHeight: 500,
                                            overflow: 'auto',
                                        },
                                    }}
                                >
                                    <JsonViewer
                                        src={jsonContent}
                                        style={{ maxHeight: 'unset' }}
                                    />
                                </Card>
                            ) : (
                                <p
                                    className="m-0"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {typeof record.content === 'string'
                                        ? record.content
                                        : JSON.stringify(record.content)}
                                </p>
                            )}
                        </div>
                    );
                },
                rowExpandable: (record) => !!record.content,
            }}
            rowClassName={'group hover:cursor-pointer'}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
        />
    );
}
