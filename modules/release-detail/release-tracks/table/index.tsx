import ArtistSelect from '@/components/ui/select/artist-select';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { SCREEN } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Form, Input, Tabs } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import TrackActionButton from '../button/track-action';
import AudioSpecifications from '../form/audio-specifications';
import OtherMetadataForm from '../form/other-metadata-form';
import TracksForm from '../form/track-form';
import { TrackWaveform } from '../track-wave-form';

type Props = {
    handleRemoveTrack: (trackId: string) => void;
} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({
    handleRemoveTrack,
    ...props
}: Props) {
    const [form] = Form.useForm();
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const formValues = useReleaseFormStore((state) => state.formValues);

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
            width: 300,
            render: (value, record) => {
                return (
                    <div className="w-full">
                        <TrackWaveform key={record.id} data={record} />
                    </div>
                );
            },
        },
        {
            title: messages('tracks.name'),
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            width: 300,
            render: (value, record) => {
                return <Input defaultValue={value} />;
            },
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artist',
            key: 'artist',
            align: 'left',
            width: 200,
            render: (value) => {
                return (
                    <ArtistSelect
                        placeholder="Chọn nghệ sĩ"
                        value={value}
                        className="w-full"
                    />
                );
            },
        },
        // {
        //     title: 'Nguồn gốc',
        //     dataIndex: '',
        //     key: '',
        //     align: 'left',
        //     width: 150,
        //     render: (value) => {
        //         return (
        //             <Select
        //                 className="w-full"
        //                 placeholder="Chọn nguồn gốc"
        //                 options={originalSourceList}
        //             />
        //         );
        //     },
        // },
        // {
        //     title: (
        //         <div className="flex items-center justify-between">
        //             <span>Ngôn ngữ</span>
        //             <div>
        //                 <IconInfoTooltip title="Ngôn ngữ chính được thể hiện trong bài hát" />
        //             </div>
        //         </div>
        //     ),
        //     dataIndex: '',
        //     key: '',
        //     align: 'left',
        //     width: 120,
        //     render: (value) => {
        //         return (
        //             <Select
        //                 className="w-full"
        //                 placeholder="Chọn ngôn ngữ"
        //                 options={languageList}
        //             />
        //         );
        //     },
        // },
        // {
        //     title: (
        //         <div className="flex items-center justify-between">
        //             <span>Nội dung nhạy cảm</span>
        //             <div>
        //                 <IconInfoTooltip title="Tích nếu nội dung bài hát này có chứa nội dung nhạy cảm" />
        //             </div>
        //         </div>
        //     ),
        //     dataIndex: '',
        //     key: '',
        //     align: 'center',
        //     width: 125,
        //     render: (value) => {
        //         return (
        //             <div className="flex items-center justify-center gap-2">
        //                 <Checkbox />
        //             </div>
        //         );
        //     },
        // },
        {
            title: messages('common.status'),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 200,
            render: (value) => {
                return (
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {messages('common.draft')}
                    </span>
                );
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 40,
            render: (value, record) => (
                <TrackActionButton
                    showDelete
                    onShowDelete={() => handleRemoveTrack(record?.id)}
                    showDownload
                />
            ),
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
                label: <span className="font-medium">Thông số kỹ thuật</span>,
                children: <AudioSpecifications trackData={record} />,
            },
            // {
            //     key: '4',
            //     label: <span className="font-medium">Xuất bản</span>,
            //     children: <PublishingForm />,
            // },
        ];
        return (
            <div className="px-20 py-4">
                <Tabs items={items} />
            </div>
        );
    };
    // const { height, width } = useWindowSize();
    // const isSmallDevice = Number(width) <= SCREEN.MD;
    // const scrollY = () => {
    //     if (isSmallDevice) return undefined;
    //     if (!height) return undefined;
    //     return height - 140 - 64;
    // };

    return (
        <div className="w-full">
            <SortableTable
                key="main"
                {...props}
                pagination={false}
                columns={columns}
                rowClassName={() => 'group'}
                onDragEnd={handleDragEnd}
                expandable={{
                    expandedRowRender,
                    expandedRowClassName: () => '!z-0 custom-track-expanded',
                }}
                scroll={{ x: SCREEN.XXL }}
            />
        </div>
    );
}
