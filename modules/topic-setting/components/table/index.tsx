import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SCREEN } from '@/enums/common';
import { getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { TopicData } from '@/modules/topic/types';
import UserSelect from '@/modules/user/components/user-select';
import { useWindowSize } from '@uidotdev/usehooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { TopicAssigneePayload } from '../../types';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    topicDataSource: TopicData[];
    topicAssigneeSubmit: TopicAssigneePayload[];
    handleAddTopicAssignee: (topicAssignee: TopicAssigneePayload) => void;
    // topicRowSelection: TableRowSelection<any>;
};

export default function TopicSettingTable({
    topicDataSource,
    topicAssigneeSubmit,
    // topicRowSelection,
    handleAddTopicAssignee,
    ...props
}: Props) {
    const messages = useTranslations();
    const { height, width } = useWindowSize();
    const locale = useLocale();
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
                    assigneeId: cell ?? null,
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
                        value = data.assigneeId;
                    }
                }
                return (
                    <UserSelect
                        value={value}
                        allowClear
                        fallback={fallback}
                        onChange={(value) =>
                            handleAddTopicAssignee({
                                ...topicAssignee,
                                assigneeId: value ?? null,
                            })
                        }
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
