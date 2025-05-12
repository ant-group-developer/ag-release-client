import ActionButton from '@/components/ui/button/action-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { LOCALE } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { ColorPicker } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_PRIORITY } from '../../enums';
import { useUpdatePriorityOrder } from '../../hooks/use-update-priority-order';
import { PriorityData } from '../../types';

type Props = {} & Omit<SortableTableProps<PriorityData>, 'columns'>;

export default function PrioritiesTable({ ...props }: Props) {
    const locale = useLocale();
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updatePriorityOrder } = useUpdatePriorityOrder();

    const handleDragEnd: OnDragEnd<PriorityData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        updatePriorityOrder({
            payload: { data: payload },
            onSuccess: () => {},
            onError: () => {},
        });
    };

    const columns: ColumnType<PriorityData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
        },
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('priority.name'),
            dataIndex: locale === LOCALE.VI ? 'nameVi' : 'nameEn',
            key: 'name',
            align: 'left',
            width: 100,
        },
        {
            title: messages('priority.color'),
            dataIndex: 'color',
            key: 'color',
            align: 'center',
            width: 100,
            render: (value) => <ColorPicker value={value} disabled showText />,
        },
        {
            title: messages('priority.orderCount'),
            dataIndex: 'orderCount',
            key: 'order_count',
            align: 'center',
            width: 100,
        },
        {
            title: messages('priority.note'),
            dataIndex: 'note',
            key: 'note',
            align: 'left',
            width: 100,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 100,

            render: (value, record) => {
                const orderCount = record.order_count;
                return (
                    <ActionButton
                        showDelete={!orderCount || orderCount <= 0}
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_PRIORITY.DELETE, record)
                        }
                        showUpdate
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_PRIORITY.UPDATE, record)
                        }
                    />
                );
            },
        },
    ];

    return (
        <SortableTable
            key="main"
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={() => 'group'}
            onDragEnd={handleDragEnd}
        />
    );
}
