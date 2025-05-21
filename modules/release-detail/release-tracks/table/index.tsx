import ActionButton from '@/components/ui/button/action-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/tracks/types';
import { Checkbox, Select } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';

type Props = {} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({ ...props }: Props) {
    const locale = useLocale();
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const handleDragEnd: OnDragEnd<TrackData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
    };

    const columns: ColumnType<TrackData>[] = [
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
            title: '',
            dataIndex: '',
            key: 'name',
            align: 'center',
            width: 200,
        },
        {
            title: messages('tracks.label'),
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            width: 150,
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artist',
            key: 'artist',
            align: 'left',
            width: 150,
        },
        {
            title: 'Nguồn gốc',
            dataIndex: '',
            key: '',
            align: 'left',
            width: 100,
            render: (value) => {
                return (
                    <Select
                        className="w-full"
                        placeholder="Chọn nguồn gốc"
                        options={[{ label: 'Tác phẩm gốc', value: 'original' }]}
                    />
                );
            },
        },
        {
            title: 'Ngôn ngữ',
            dataIndex: '',
            key: '',
            align: 'left',
            width: 100,
            render: (value) => {
                return (
                    <Select
                        className="w-full"
                        placeholder="Chọn ngôn ngữ"
                        options={[{ label: 'Tiếng Việt', value: 'vi' }]}
                    />
                );
            },
        },
        {
            title: 'Nội dung nhạy cảm',
            dataIndex: '',
            key: '',
            align: 'center',
            width: 120,
            render: (value) => {
                return <Checkbox />;
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 50,
            render: () => <ActionButton showUpdate showDetail showDelete />,
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
