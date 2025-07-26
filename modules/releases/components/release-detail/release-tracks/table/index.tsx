import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTrackReadyStore } from '@/modules/releases/hooks/track-ready-store';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { useUpdateTrackOrder } from '@/modules/tracks/hooks/use-update-track-order';
import { TrackData } from '@/modules/tracks/types';
import {
    UpdateTrackOrderPayload,
    UpdateTrackPayload,
} from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { UpdateVariables } from '@/types/api';
import { Input, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import TrackActionButton from '../button/track-action';
import AudioSpecifications from '../form/audio-specifications';
import OtherMetadataForm from '../form/other-metadata-form';
import TracksForm from '../form/track-form';
import ViewAll from '../form/view-all';
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
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    const { updateTrackDraft } = useUpdateTrackDraft();
    const { updateTrackOrder } = useUpdateTrackOrder();

    const handleDragEnd: OnDragEnd<TrackData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        const variables: UpdateTrackOrderPayload = {
            trackDrafts: payload,
        };

        updateTrackOrder(variables);
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
            render: (value, record, index) => {
                return (
                    <div className="w-[330px]">
                        <TrackWaveform
                            key={`${record.id}-${index}`}
                            data={record}
                        />
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
                        maxLength={100}
                        minLength={1}
                        defaultValue={record?.title}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length < 1) {
                                return showNotification(
                                    'error',
                                    messages('validation.min', { number: 1 })
                                );
                            }
                            debouncedUpdate(record.id, {
                                title: value,
                            });
                        }}
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
            render: (value, record, index) => {
                return (
                    <div className="flex flex-wrap gap-y-2">
                        {record?.trackArtists?.map(
                            (trackArtist: TrackArtistData) => (
                                <Tag
                                    key={`${record.id}-${trackArtist.id}`}
                                    closeIcon
                                    onClose={(e) => {
                                        e.preventDefault();
                                        openModal(
                                            TYPE_MODAL_TRACK_ARTIST.DELETE,
                                            trackArtist
                                        );
                                    }}
                                >
                                    {trackArtist?.artist?.name}
                                </Tag>
                            )
                        )}
                        <Tag
                            key={`${record.id}-add-artist`}
                            className="border-dashed hover:border-blue-500"
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
            render: (value, record) => {
                return (
                    <TrackActionButton
                        showDelete
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_TRACK.DELETE, record)
                        }
                        showDownload
                        onShowDownload={async () => {
                            const response =
                                await bucketApi.getLinkDownloadFile(
                                    record?.audioFile?.fileId as string
                                );
                            window.open(response?.data?.data);
                        }}
                    />
                );
            },
        },
    ];

    const expandedRowRender = (record: TrackData, index: number) => {
        const items = [
            {
                key: `${record.id}-track-form`,
                label: (
                    <span className="font-medium">
                        {messages('tracks.label')} & {messages('artist.label')}
                    </span>
                ),
                children: (
                    <TracksForm
                        key={`${record.id}-track-form-content`}
                        trackData={record}
                        index={index}
                    />
                ),
            },
            {
                key: `${record.id}-metadata-form`,
                label: (
                    <span className="font-medium">
                        {messages('releases.otherMetadata')}
                    </span>
                ),
                children: (
                    <OtherMetadataForm
                        key={`${record.id}-metadata-form-content`}
                        trackData={record}
                    />
                ),
            },
            {
                key: `${record.id}-audio-specs`,
                label: (
                    <span className="font-medium">
                        {messages('common.specification')}
                    </span>
                ),
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
            {
                key: `${record.id}-view-all`,
                label: (
                    <span className="font-medium">
                        {messages('common.viewAll')}
                    </span>
                ),
                children: (
                    <ViewAll
                        key={`${record.id}-view-all`}
                        trackData={record}
                        updateTrackDraft={(data) =>
                            debouncedUpdate(record.id, data)
                        }
                        index={index}
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

    // Cho phép mở nhiều hàng cùng lúc
    const handleExpand = (expanded: boolean, record: TrackData) => {
        const newExpandedKeys = [...expandedRowKeys];
        if (expanded) {
            newExpandedKeys.push(record.id);
        } else {
            const index = newExpandedKeys.indexOf(record.id);
            if (index !== -1) {
                newExpandedKeys.splice(index, 1);
            }
        }
        setExpandedRowKeys(newExpandedKeys);
    };

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const match = hash.match(/tracks\.(\d+)/);
            if (match && props.dataSource) {
                const index = parseInt(match[1]);
                if (index >= 0 && index < props.dataSource.length) {
                    const trackId = props.dataSource[index].id;
                    setExpandedRowKeys([trackId]);
                }
            }
        };

        handleHashChange();

        // Thêm listener để xử lý khi hash thay đổi
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [props.dataSource, window?.location?.hash]);

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
                    expandedRowKeys,
                    onExpand: handleExpand,
                    expandedRowClassName: () => '!z-0 custom-track-expanded',
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}
