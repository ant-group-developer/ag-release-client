import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTrackReadyStore } from '@/modules/releases/hooks/track-ready-store';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { Input, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import TrackActionButton from '../button/track-action';
import AudioSpecifications from '../form/audio-specifications';
import OtherMetadataForm from '../form/other-metadata-form';
import TracksForm from '../form/track-form';
import { TrackWaveform } from '../track-wave-form';

type Props = {} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({ ...props }: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formErrors = useReleaseFormStore((state) => state.validationErrors);
    const setTrackReadyMap = useTrackReadyStore(
        (state) => state.setTrackReadyMap
    );

    const { updateTrackDraft } = useUpdateTrackDraft();

    const handleDragEnd: OnDragEnd<TrackData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
    };

    const debouncedUpdate = useCallback(
        debounce((id, data) => {
            if (!formValues.id) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 500),
        [formValues.id]
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
                            debouncedUpdate(record.id, {
                                title: e.target.value,
                            })
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
                        {record?.trackArtists?.map(
                            (trackArtist: TrackArtistData) => (
                                <Tag
                                    key={`${record.id}`}
                                    closeIcon
                                    onClose={(e) => {
                                        e.preventDefault();
                                        openModal(
                                            TYPE_MODAL_TRACK_ARTIST.DELETE,
                                            record
                                        );
                                    }}
                                >
                                    {trackArtist?.artist?.name}
                                </Tag>
                            )
                        )}
                        <Tag
                            key={`${record.id}-add-artist`}
                            className="border-dashed"
                            onClick={() =>
                                openModal(TYPE_MODAL_TRACK_ARTIST.ADD, record)
                            }
                        >
                            + {messages('artist.add')}
                        </Tag>
                    </div>
                );
            },
        },
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
                        {isTrackError
                            ? messages('common.missingInformation')
                            : messages('common.ready')}
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
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_TRACK.DELETE, record)
                    }
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
                        updateTrackDraft={(data) =>
                            debouncedUpdate(record.id, data)
                        }
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
                        updateTrackDraft={(data) =>
                            debouncedUpdate(record.id, data)
                        }
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
                        updateTrackDraft={(data) =>
                            debouncedUpdate(record.id, data)
                        }
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
