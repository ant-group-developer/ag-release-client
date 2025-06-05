import ArtistSelect from '@/components/ui/select/artist-select';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { originalSourceList } from '@/constants/fakeData';
import { SCREEN } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Checkbox, Form, Input, Select, Tabs } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import TrackActionButton from '../button/track-action';
import OtherMetadataForm from '../form/other-metadata-form';
import PublishingForm from '../form/publishing-form';
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
            width: 200,
            render: (value, record) => {
                return (
                    <div className="w-full">
                        <TrackWaveform key={record.id} data={record} />
                    </div>
                );
            },
        },
        {
            title: messages('tracks.label'),
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            width: 200,
            render: (value, record) => {
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
                    <ArtistSelect
                        placeholder="Chọn nghệ sĩ"
                        value={value}
                        className="w-full"
                    />
                );
            },
        },
        {
            title: 'Nguồn gốc',
            dataIndex: '',
            key: '',
            align: 'left',
            width: 150,
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
        {
            title: (
                <div className="flex items-center justify-between">
                    <span>Nội dung nhạy cảm</span>
                    <div>
                        <IconInfoTooltip title="Tích nếu nội dung bài hát này có chứa nội dung nhạy cảm" />
                    </div>
                </div>
            ),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 125,
            render: (value) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Checkbox />
                    </div>
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
                children: <TracksForm form={form} trackData={record} />,
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
