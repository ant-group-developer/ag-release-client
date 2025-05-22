import ActionButton from '@/components/ui/button/action-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import {
    artistList,
    languageList,
    originalSourceList,
} from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/tracks/types';
import { Checkbox, Input, Select, Tabs } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import OtherMetadataForm from '../form/other-metadata-form';
import PublishingForm from '../form/publishing-form';
import TracksForm from '../form/track-form';

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
            render: (value, record) => {
                console.log(value);
                return <Input defaultValue={value} />;
            },
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artist',
            key: 'artist',
            align: 'left',
            width: 150,
            render: (value) => {
                return (
                    <Select
                        className="w-full"
                        placeholder="Chọn nghệ sĩ"
                        options={artistList}
                    />
                );
            },
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
                        options={originalSourceList}
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
                        options={languageList}
                    />
                );
            },
        },
        {
            title: 'Nội dung nhạy cảm',
            dataIndex: '',
            key: '',
            align: 'center',
            width: 60,
            render: (value) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Checkbox />
                        <IconInfoTooltip title="Tích nếu nội dung bài hát này có chứa nội dung nhạy cảm" />
                    </div>
                );
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 50,
            render: () => <ActionButton showDelete />,
        },
    ];

    const expandedRowRender = (record: TrackData) => {
        const items = [
            {
                key: '1',
                label: <span className="font-medium">Bản nhạc & nghệ sĩ</span>,
                children: <TracksForm trackData={record} />,
            },
            {
                key: '2',
                label: <span className="font-medium">Các metadata khác</span>,
                children: <OtherMetadataForm />,
            },
            {
                key: '3',
                label: <span className="font-medium">Xuất bản</span>,
                children: <PublishingForm />,
            },
        ];
        return (
            <div className="px-20 py-4">
                <Tabs items={items} />
            </div>
        );
    };
    return (
        <SortableTable
            key="main"
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={() => 'group'}
            onDragEnd={handleDragEnd}
            expandable={{
                expandedRowRender,
                expandedRowClassName: () => '!z-0',
            }}
        />
    );
}
