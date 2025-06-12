import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import useModalStore from '@/hooks/use-modal';
import { ArtistData } from '@/modules/artist/types';
import { TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Input, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
    const [formValidity, setFormValidity] = useState({
        trackForm: false,
        metadataForm: false,
        audioSpecsForm: false,
    });
    const [isReady, setIsReady] = useState(false);

    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const formValues = useReleaseFormStore((state) => state.formValues);

    const handleDragEnd: OnDragEnd<TrackData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
    };

    const checkFormValidity = (formName: string, valid: boolean) => {
        setFormValidity((prevValidity) => {
            const updatedValidity = { ...prevValidity, [formName]: valid };

            // Kiểm tra nếu tất cả các form hợp lệ thì set "ready" thành true
            const allValid = Object.values(updatedValidity).every(
                (validity) => validity === true
            );

            setIsReady(allValid);
            return updatedValidity;
        });
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
                return <Input defaultValue={value} />;
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
                                key={artist.id}
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
            dataIndex: '',
            key: '',
            align: 'center',
            width: 150,
            render: (value) => {
                const color = isReady ? 'green' : 'red';
                return (
                    <Tag bordered color={color}>
                        {/* <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"> */}
                        {/* {messages('common.draft')} */}
                        {isReady ? 'Sẵn sàng' : 'Lỗi'}
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
                key: '1',
                label: <span className="font-medium">Bản nhạc & nghệ sĩ</span>,
                children: (
                    <TracksForm
                        trackData={record}
                        checkTrackValid={(valid) =>
                            checkFormValidity('trackForm', valid)
                        }
                    />
                ),
            },
            {
                key: '2',
                label: <span className="font-medium">Các metadata khác</span>,
                children: (
                    <OtherMetadataForm
                        checkTrackValid={(valid) =>
                            checkFormValidity('metadataForm', valid)
                        }
                    />
                ),
            },
            {
                key: '3',
                label: <span className="font-medium">Thông số kỹ thuật</span>,
                children: (
                    <AudioSpecifications
                        trackData={record}
                        checkTrackValid={(valid) =>
                            checkFormValidity('audioSpecsForm', valid)
                        }
                    />
                ),
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
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}
