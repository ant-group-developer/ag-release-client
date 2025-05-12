import ActionButton from '@/components/ui/button/action-button';
import SortableTable, {
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { SCREEN } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OpenModalProps } from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import LazyFetchImage from '@/modules/topic/components/table/lazy-fetch-image';
import { useWindowSize } from '@uidotdev/usehooks';
import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_TOPIC } from '../../enums';
import { useUpdateTopic } from '../../hooks/use-update-topic';
import { TopicData } from '../../types';
import { UpdateTopic } from '../../types/update-topic';

type Props = Omit<SortableTableProps<TopicData>, 'columns'> & {
    openModal: OpenModalProps<TYPE_MODAL_TOPIC, TopicData>;
};

export default function TopicTable({ openModal, ...props }: Props) {
    const messages = useTranslations();
    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const { canDelete, canUpdate } = usePermissionStore(
        (state) => state.permission.topic
    );
    const { updateTopic } = useUpdateTopic();

    const handleUpdateTopic = (record: TopicData) => {
        const variables: UpdateTopic = {
            topicId: record.id,
            payload: {
                isActive: !record.isActive,
            },
        };
        updateTopic(variables);
    };

    const topicsWithIndex =
        props.dataSource?.map((record, index) => ({
            ...record,
            parentIndex: index + 1,
        })) || [];

    const columns: ColumnType<TopicData>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('order.illustrativeImage'),
            dataIndex: 'illustrativeImage',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <LazyFetchImage
                    data={record}
                    className="aspect-video overflow-hidden rounded-lg object-cover"
                    // preview={{ maskClassName: 'rounded-lg' }}
                />
            ),
        },
        {
            title: messages('common.code'),
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 100,
        },

        {
            title: messages('common.description'),
            dataIndex: 'description',
            key: 'description',
            align: 'left',
            width: 240,
            render: (value: string) => (
                <span className="line-clamp-3 whitespace-pre-line">
                    {value}
                </span>
            ),
        },
        {
            title: messages('common.note'),
            dataIndex: 'note',
            key: 'note',
            align: 'left',
            width: 150,
            render: (value: string) => (
                <span className="line-clamp-3 whitespace-pre-line">
                    {value}
                </span>
            ),
            ellipsis: true,
        },
        {
            title: messages('status.active'),
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            width: 80,
            render: (value, record) => (
                <Switch
                    disabled={!canUpdate}
                    onChange={() => handleUpdateTopic(record)}
                    checkedChildren={messages('status.on')}
                    defaultChecked={record.isActive}
                    unCheckedChildren={messages('status.off')}
                />
            ),
        },
        {
            title: messages('status.on'),
            dataIndex: 'totalActiveChildren',
            key: 'totalActiveChildren',
            align: 'center',
            width: 50,
        },
        {
            title: messages('status.off'),
            dataIndex: 'totalInactiveChildren',
            key: 'totalInactiveChildren',
            align: 'center',
            width: 50,
        },
        {
            title: messages('common.userCreator'),
            dataIndex: 'userCreator',
            key: 'userCreator',
            align: 'left',
            width: 120,
            render: (value, record) => (
                <span className="truncate">{record?.creatorUser?.name}</span>
            ),
        },
        {
            title: messages('common.dateCreated'),
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            align: 'center',
            render: (value) => formattedDate(value),
            width: 110,
        },
        {
            title: messages('common.dateUpdated'),
            dataIndex: 'dateUpdated',
            key: 'dateUpdated',
            align: 'center',
            render: (value) => formattedDate(value),
            width: 110,
        },
    ];

    if (canUpdate || canDelete) {
        columns.push({
            title: messages('common.action'),
            dataIndex: '',
            key: 'action',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <ActionButton
                    showUpdate={canUpdate}
                    showDelete={canDelete}
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_TOPIC.UPDATE, record)
                    }
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_TOPIC.DELETE, value)
                    }
                />
            ),
        });
    }

    const expandable: SortableTableProps<TopicData>['expandable'] = {
        expandedRowRender: (record: any) => {
            const childColumns = columns.map((column) => {
                if (column.title === messages('common.iNo')) {
                    return {
                        ...column,
                        render: (_: any, __: any, index: number) => {
                            // Sử dụng parentIndex được truyền trong các record con
                            return record.parentIndex
                                ? `${record.parentIndex}.${index + 1}`
                                : index + 1;
                        },
                    };
                }
                if (
                    column.dataIndex === 'totalActiveChildren' ||
                    column.dataIndex === 'totalInactiveChildren'
                ) {
                    return {
                        ...column,
                        render: () => null,
                    };
                }
                return column;
            });
            return (
                <div className="rounded-lg p-2">
                    <SortableTable
                        className="overflow-hidden rounded-lg border"
                        key={record.id.toString()}
                        {...props}
                        loading={false}
                        expandable={expandable}
                        dataSource={record.child as any[]}
                        pagination={false}
                        columns={childColumns}
                        showHeader={false}
                        sticky
                        scroll={{ y: 450 }}
                    />
                </div>
            );
        },
        columnWidth: 40,
        rowExpandable: (record: any) => Number(record.child?.length) > 0,
    };

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const headerFooterHeight = 152;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };

    return (
        <SortableTable
            key="main"
            {...props}
            dataSource={topicsWithIndex}
            pagination={false}
            columns={columns}
            expandable={expandable}
            scroll={{
                x: SCREEN.XXL,
                y: scrollY(),
            }}
            rowClassName={() => 'group'}
        />
    );
}
