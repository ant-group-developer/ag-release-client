import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SCREEN } from '@/enums/common';
import { getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { TopicAssigneePayload } from '@/modules/topic-setting/types';
import { TopicData } from '@/modules/topic/types';
import UserSelect from '@/modules/user/components/user-select';
import { useWindowSize } from '@uidotdev/usehooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    topicDataSource: TopicData[];
    topicAssigneeSubmit: TopicAssigneePayload[];
    handleAddTopicAssignee: (topicAssignee: TopicAssigneePayload) => void;
    // topicRowSelection: TableRowSelection<any>;
};

export default function ApproverSettingTable({
    topicDataSource,
    topicAssigneeSubmit,
    // topicRowSelection,
    handleAddTopicAssignee,
    ...props
}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const { productTypesData } = useGetProductTypes();

    const productTypeColumns: ColumnsType<TopicData> =
        productTypesData.items.map((item) => ({
            title: item.nameVi,
            dataIndex: item.code,
            width: 130,
            render: (cell, record) => {
                const isParent = !!record?.parent?.id;
                if (!isParent) return null;
                const topicAssignee: TopicAssigneePayload = {
                    // id: record.id,
                    topicId: record.id,
                    // assigneeId: value ?? null,
                    approverId: cell ?? null,
                    productTypeId: item?.id,
                };
                const fallback = getNameByLocale(
                    item.nameEn,
                    item.nameVi,
                    locale
                );
                let value = cell;
                if (topicAssigneeSubmit.length > 0) {
                    const data = topicAssigneeSubmit.find(
                        (i) =>
                            i.topicId === record.id &&
                            i.productTypeId === item.id
                    );
                    if (data) {
                        value = data.approverId;
                    }
                }
                return (
                    <UserSelect
                        // defaultValue={value}
                        value={value}
                        allowClear
                        onChange={(value) =>
                            handleAddTopicAssignee({
                                ...topicAssignee,
                                approverId: value ?? null,
                            })
                        }
                        fallback={fallback}
                        onClear={() => handleAddTopicAssignee(topicAssignee)}
                    />
                );
            },
        }));

    const topicColumns: ColumnsType<TopicData> = [
        {
            dataIndex: '',
            title: messages('common.iNo'),
            align: 'center',
            width: 80,
            render: (text, record, index) => {
                const itemIndex = getIndex(topicDataSource.length, 1, index);

                const parentIndex = topicDataSource?.findIndex(
                    (item) => item.id === record.parent?.id
                );

                if (parentIndex !== undefined && parentIndex > -1) {
                    return `${parentIndex + 1}.${itemIndex}`;
                }
                return itemIndex;
            },
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 80,
        },
        {
            title: messages('common.status'),
            dataIndex: 'isActive',
            width: 60,
            align: 'center',
            ellipsis: true,
            render: (value) => {
                return value ? (
                    <Tag bordered={false} color="green">
                        {messages('status.on')}
                    </Tag>
                ) : (
                    <Tag bordered={false} color="red">
                        {messages('status.off')}
                    </Tag>
                );
            },
        },
        {
            title: messages('common.description'),
            dataIndex: 'description',
            width: 170,
            ellipsis: true,
        },
        // {
        //     title: 'Video',
        //     dataIndex: 'assigneeVideo',
        //     align: 'left',
        //     width: 100,
        //     ellipsis: true,
        //     render: (value, record) => {
        //         const isParent = !!record?.parent?.id;
        //         if (!isParent) return null;

        //         const topicAssignee: TopicAssigneePayload = {
        //             // id: record.id,
        //             topicId: record.id,
        //             assigneeId: value ?? null,
        //             type: UPLOAD_TYPE.VIDEO,
        //         };
        //         return (
        //             <UserSelect
        //                 defaultValue={value}
        //                 allowClear
        //                 onChange={(value) =>
        //                     handleAddTopicAssignee({
        //                         ...topicAssignee,
        //                         assigneeId: value ?? null,
        //                     })
        //                 }
        //             />
        //         );
        //     },
        // },
        // {
        //     title: messages('common.thumbnail'),
        //     dataIndex: 'assigneeImage',
        //     width: 100,
        //     ellipsis: true,
        //     render: (value, record) => {
        //         const isParent = !!record?.parent?.id;
        //         if (!isParent) return null;
        //         const topicAssignee: TopicAssigneePayload = {
        //             // id: record.id,
        //             topicId: record.id,
        //             assigneeId: value ?? null,
        //             type: UPLOAD_TYPE.IMAGE,
        //         };
        //         return (
        //             <UserSelect
        //                 defaultValue={value}
        //                 allowClear
        //                 onChange={(value) =>
        //                     handleAddTopicAssignee({
        //                         ...topicAssignee,
        //                         assigneeId: value ?? null,
        //                     })
        //                 }
        //                 onClear={() => handleAddTopicAssignee(topicAssignee)}
        //             />
        //         );
        //     },
        // },
        // {
        //     title: messages('topicConfig.source'),
        //     dataIndex: 'source',
        //     width: 100,
        //     ellipsis: true,
        //     render: (value, record) => {
        //         const isParent = !!record?.parent?.id;
        //         if (!isParent) return null;
        //         const topicAssignee: TopicAssigneePayload = {
        //             // id: record.id,
        //             topicId: record.id,
        //             assigneeId: value ?? null,
        //             type: UPLOAD_TYPE.SOURCE,
        //         };
        //         return (
        //             <UserSelect
        //                 defaultValue={value}
        //                 allowClear
        //                 onChange={(value) =>
        //                     handleAddTopicAssignee({
        //                         ...topicAssignee,
        //                         assigneeId: value,
        //                     })
        //                 }
        //                 onClear={() => handleAddTopicAssignee(topicAssignee)}
        //             />
        //         );
        //     },
        // },
        ...productTypeColumns,
    ];

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const headerFooterHeight = 250;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };
    return (
        <AppTable
            {...props}
            bordered
            // rowSelection={
            //     {
            //         // ...topicRowSelection,
            //         // checkStrictly: false,
            //     }
            // }
            dataSource={topicDataSource}
            scroll={{
                x: 0,
                y: scrollY(),
            }}
            columns={topicColumns}
        />
    );
}
