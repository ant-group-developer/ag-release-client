import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SCREEN } from '@/enums/common';
import { getIndex } from '@/helpers/common';
import { TopicData } from '@/modules/topic/types';
import { useWindowSize } from '@uidotdev/usehooks';
import type { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useTranslations } from 'next-intl';

type Props = {
    topicDataSource: TopicData[];
    topicRowSelection: TableRowSelection<any>;
} & Omit<AppTableProps<any>, 'columns'>;

function GrantPermissionTable({
    topicRowSelection,
    topicDataSource,
    ...props
}: Props) {
    const messages = useTranslations();
    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const headerFooterHeight = 250;

        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };

    const topicColumns: ColumnsType<TopicData> = [
        {
            dataIndex: '',
            title: messages('common.iNo'),
            align: 'center',
            width: 150,
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
            width: 200,
        },
        {
            title: messages('common.description'),
            dataIndex: 'description',
        },
    ];

    return (
        <AppTable
            {...props}
            bordered
            rowSelection={{
                ...topicRowSelection,
                // checkStrictly: false,
            }}
            dataSource={topicDataSource}
            scroll={{
                x: 0,
                y: scrollY(),
            }}
            columns={topicColumns}
        />
    );
}

export default GrantPermissionTable;
