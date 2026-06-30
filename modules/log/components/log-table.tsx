import JsonViewer from '@/components/ui/json-viewer';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { formattedDate, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { ProColumns } from '@ant-design/pro-components';
import { Popover, Tag, Tooltip, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { LOG_LEVEL_MSG_KEY, LOG_TYPE_MSG_KEY } from '../constants';
import { LOG_LEVEL, LOG_SORT_FIELD, LOG_TYPE } from '../enums';
import { DataFilterLogs, LogsData } from '../types/data';

type Props = Omit<AppProTableProps<LogsData>, 'columns'> & {
    dataFilter: DataFilterLogs;
    onChangeFilter: OnChangeFilter<DataFilterLogs>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

function LogTable({ dataFilter, onChangeFilter, ...props }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const columns: ProColumns<LogsData>[] = [
        {
            title: messages('log.columns.level'),
            dataIndex: LOG_SORT_FIELD.LOG_LEVEL,
            width: 120,
            align: 'center',
            ellipsis: true,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                LOG_SORT_FIELD.LOG_LEVEL
            ),
            render: (_, record) => {
                let color = '';
                switch (record.level) {
                    case LOG_LEVEL.SUCCESS:
                        color = 'green';
                        break;
                    case LOG_LEVEL.LOG:
                        color = 'blue';
                        break;
                    case LOG_LEVEL.WARNING:
                        color = 'orange';
                        break;
                    case LOG_LEVEL.ERROR:
                        color = 'red';
                        break;
                }

                return (
                    <Tag color={color}>
                        {messages(LOG_LEVEL_MSG_KEY[record.level] as any)}
                    </Tag>
                );
            },
        },
        {
            title: messages('log.columns.type'),
            dataIndex: LOG_SORT_FIELD.LOG_TYPE,
            width: 120,
            align: 'center',
            ellipsis: true,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                LOG_SORT_FIELD.LOG_TYPE
            ),
            render: (_, record) => {
                const color =
                    record.type === LOG_TYPE.BUSINESS ? 'cyan' : 'purple';
                return (
                    <Tag color={color} className="text-xs">
                        {messages(LOG_TYPE_MSG_KEY[record.type] as any)}
                    </Tag>
                );
            },
        },
        {
            title: messages('log.columns.module'),
            dataIndex: LOG_SORT_FIELD.LOG_MODULE,
            width: 200,
            ellipsis: true,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                LOG_SORT_FIELD.LOG_MODULE
            ),
            render: (_, record) => {
                if (!record.modules) return '-';

                const modules = record.modules
                    .split(',')
                    .map((m) => m.trim())
                    .filter(Boolean);

                if (modules.length === 0) return '-';

                const formatModuleName = (name: string) => {
                    const lower = name.toLowerCase();
                    return lower.charAt(0).toUpperCase() + lower.slice(1);
                };

                const maxVisible = 2;
                const visibleTags = modules.slice(0, maxVisible);
                const hiddenTags = modules.slice(maxVisible);

                const renderTag = (name: string) => (
                    <Tag key={name} className="!mr-0">
                        {formatModuleName(name)}
                    </Tag>
                );

                const renderHiddenTagsPopover = () => (
                    <div className="flex max-w-[250px] flex-wrap gap-1">
                        {hiddenTags.map((name) => renderTag(name))}
                    </div>
                );

                return (
                    <div className="flex flex-wrap gap-1">
                        {visibleTags.map((name) => renderTag(name))}
                        {hiddenTags.length > 0 && (
                            <Popover
                                content={renderHiddenTagsPopover()}
                                trigger="hover"
                            >
                                <Tag className="!mr-0 cursor-pointer">
                                    +{hiddenTags.length}
                                </Tag>
                            </Popover>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.content'),
            dataIndex: 'message',
            width: 700,
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Tooltip title={record.message} placement="topLeft">
                        {record.message}
                    </Tooltip>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: LOG_SORT_FIELD.LOG_CREATED_AT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                LOG_SORT_FIELD.LOG_CREATED_AT
            ),
            render: (_, record) => formattedDate(record.createdAt),
        },
    ];

    return (
        <AppProTable
            {...props}
            pagination={false}
            columns={columns}
            scroll={{ x: 1400 }}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            expandable={{
                expandedRowRender: ({ data }) => (
                    <div className="px-4 py-2">
                        {data && (
                            <div>
                                <h3 className="mb-1 font-semibold">
                                    {messages('log.columns.dataDetail')}
                                </h3>
                                <JsonViewer
                                    src={
                                        typeof data === 'string'
                                            ? JSON.parse(data)
                                            : data
                                    }
                                />
                            </div>
                        )}
                    </div>
                ),
                rowExpandable: ({ data }) => !!data,
            }}
        />
    );
}

export default LogTable;
