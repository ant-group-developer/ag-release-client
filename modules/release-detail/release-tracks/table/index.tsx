import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import useModalStore from '@/hooks/use-modal';
import { ArtistData } from '@/modules/artist/types';
import { TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTrackReadyStore } from '@/modules/releases/hooks/track-ready-store';
import { TrackData } from '@/modules/tracks/types';
import { Input, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import TrackActionButton from '../button/track-action';
import AudioSpecifications from '../form/audio-specifications';
import OtherMetadataForm from '../form/other-metadata-form';
import TracksForm from '../form/track-form';
import { TrackWaveform } from '../track-wave-form';

type FormValidationStatus = {
    trackForm: boolean;
    metadataForm: boolean;
    audioSpecsForm: boolean;
};

type Props = {
    handleRemoveTrack: (trackId: string) => void;
} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({
    handleRemoveTrack,
    ...props
}: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const openModal = useModalStore((state) => state.openModal);
    const formErrors = useReleaseFormStore((state) => state.validationErrors);
    const setTrackReadyMap = useTrackReadyStore(
        (state) => state.setTrackReadyMap
    );

    const handleDragEnd: OnDragEnd<TrackData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
    };

    const debouncedSetFormValues = useMemo(
        () =>
            debounce((track: TrackData, value: string) => {
                setFormValues({
                    ...formValues,
                    tracks: formValues?.tracks?.map((item) =>
                        item.id === track.id ? { ...item, title: value } : item
                    ),
                });
            }, 300),
        [formValues, setFormValues]
    );

    const handleChangeTitle = useCallback(
        (track: TrackData, value: string) => {
            debouncedSetFormValues(track, value);
        },
        [debouncedSetFormValues]
    );

    const columns: ColumnType<TrackData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
        },
        {
            title: messages('common.iNo'),
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: '',
            dataIndex: 'waveform',
            key: 'waveform',
            align: 'center',
            width: 300,
            render: (value, record) => {
                return (
                    <div className="w-[330px]">
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
                return (
                    <Input
                        defaultValue={value}
                        onChange={(e) =>
                            handleChangeTitle(record, e.target.value)
                        }
                    />
                );
            },
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artists',
            key: 'artists',
            align: 'left',
            width: 300,
            render: (value, record) => {
                return (
                    <div className="flex flex-wrap gap-y-2">
                        {record.artists.map((artist: ArtistData) => (
                            <Tag
                                key={`${record.id}-${artist.id}`}
                                closeIcon
                                onClose={(e) => {
                                    e.preventDefault();
                                    openModal(
                                        TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST,
                                        { trackData: record, artist }
                                    );
                                }}
                            >
                                {artist.name}
                            </Tag>
                        ))}
                        <Tag
                            key={`${record.id}-add-artist`}
                            className="border-dashed"
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST,
                                    record
                                )
                            }
                        >
                            + Thêm nghệ sĩ
                        </Tag>
                    </div>
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
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 150,
            render: (value, record, index) => {
                const isTrackError = formErrors.some(
                    (error) => error.path[1] === index
                );
                const color = isTrackError ? 'red' : 'green';
                return (
                    <Tag bordered color={color}>
                        {/* <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"> */}
                        {/* {messages('common.draft')} */}
                        {isTrackError ? 'Thiếu thông tin' : 'Sẵn sàng'}
                        {/* </span> */}
                    </Tag>
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
                key: `${record.id}-track-form`,
                label: <span className="font-medium">Bản nhạc & nghệ sĩ</span>,
                children: (
                    <TracksForm
                        key={`${record.id}-track-form-content`}
                        trackData={record}
                    />
                ),
            },
            {
                key: `${record.id}-metadata-form`,
                label: <span className="font-medium">Các metadata khác</span>,
                children: (
                    <OtherMetadataForm
                        key={`${record.id}-metadata-form-content`}
                        trackData={record}
                    />
                ),
            },
            {
                key: `${record.id}-audio-specs`,
                label: <span className="font-medium">Thông số kỹ thuật</span>,
                children: (
                    <AudioSpecifications
                        key={`${record.id}-audio-specs-content`}
                        trackData={record}
                    />
                ),
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
                {...props}
                pagination={false}
                columns={columns}
                rowClassName={() => 'group'}
                onDragEnd={handleDragEnd}
                expandable={{
                    expandedRowRender,
                    expandedRowClassName: () => '!z-0 custom-track-expanded',
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}
