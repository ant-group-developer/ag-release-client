'use client';
import IconButton from '@/components/ui/button/icon-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { SIZE_ICON } from '@/constants/common';
import { getIndex } from '@/helpers/common';
import { getTrackDetailRoute, RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { TYPE_MODAL_RELEASE, TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TRACK_TABS, TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { useUpdateTrackOrder } from '@/modules/tracks/hooks/use-update-track-order';
import { TrackData } from '@/modules/tracks/types';

import {
    UpdateTrackOrderPayload,
    UpdateTrackPayload,
} from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { UpdateVariables } from '@/types/api';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { debounce } from 'lodash';
import { SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import TrackActionButton from '../button/track-action';
import { TrackWaveform } from '../track-wave-form';
import { EditableIsrc } from './track-edit-isrc';
import { EditableTitle } from './track-edit-title';

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({ ...props }: Props) {
    // hooks - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);
    // const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const action = useReleaseActionStore((s) => s.action);
    const router = useRouter();

    // apis
    const { updateTrackDraft } = useUpdateTrackDraft();
    const { updateTrackOrder } = useUpdateTrackOrder();
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );

    // const
    const isReadMode = action !== RELEASE_DETAIL_ACTION.EDIT;

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

    const debouncedUpdate = useMemo(() => {
        return debounce((id: TrackData['id'], data: UpdateTrackPayload) => {
            if (!formValues?.id) return;

            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id,
                payload: data,
            };

            updateTrackDraft(variables);
        }, 800);
    }, [formValues?.id, updateTrackDraft]);

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    const columns: ColumnType<TrackData>[] = [
        {
            key: 'sort',
            width: 30,
            align: 'center',
        },
        {
            title: messages('common.iNo'),
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 50,
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: '',
            dataIndex: 'waveform',
            key: 'waveform',
            align: 'center',
            width: 250,
            render: (value, record, index) => {
                return (
                    <div className="min-h-10">
                        <TrackWaveform
                            key={`${record.id}-${index}`}
                            data={record}
                        />
                    </div>
                );
            },
        },
        {
            title: messages('track.label'),
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            width: 300,
            ellipsis: true,
            render: (value, record) => {
                return (
                    <EditableTitle
                        record={record}
                        isReadMode={isReadMode}
                        onUpdate={debouncedUpdate}
                        messages={messages}
                    />
                );
            },
        },
        {
            title: messages('artist.label'),
            align: 'left',
            dataIndex: 'artist',
            width: 250,
            render: (value, record) => {
                return (
                    <div>
                        <div className="flex flex-wrap gap-y-2">
                            {record?.trackArtists?.map(
                                (trackArtist: TrackArtistData) => (
                                    <Tag
                                        key={`${record.id}-${trackArtist.id}`}
                                        closeIcon
                                        onClick={() => {}}
                                        onClose={(e) => {
                                            e.preventDefault();
                                            openModal(
                                                TYPE_MODAL_TRACK_ARTIST.DELETE,
                                                trackArtist
                                            );
                                        }}
                                        closable={!isReadMode}
                                        className="max-w-full whitespace-normal break-words"
                                    >
                                        {trackArtist?.artist?.name}
                                    </Tag>
                                )
                            )}
                            {!isReadMode && (
                                <Tag
                                    key={`${record.id}-add-artist`}
                                    className="border-dashed hover:border-blue-500"
                                    onClick={() => {
                                        if (isReadMode) return;
                                        openModal(
                                            TYPE_MODAL_TRACK_ARTIST.ADD,
                                            record
                                        );
                                    }}
                                >
                                    + {messages('artist.add')}
                                </Tag>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'ISRC',
            align: 'left',
            width: 170,
            ellipsis: true,
            render: (value, record) => {
                return (
                    <EditableIsrc
                        record={record}
                        isReadMode={isReadMode}
                        onUpdate={debouncedUpdate}
                    />
                );
            },
        },
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 100,
            render: (value, record, index) => {
                const isTrackError = releaseValidateData.some((error) => {
                    const parts = error.field.split('.');
                    return parts[0] === 'tracks' && Number(parts[1]) === index;
                });
                const color = isTrackError ? 'red' : 'green';
                return (
                    <Tag bordered={false} color={color}>
                        {/* <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"> */}
                        {/* {messages('common.draft')} */}
                        {isTrackError
                            ? messages('common.error')
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
            width: 80,
            render: (value, record, index) => {
                return (
                    <div className="flex items-center justify-center">
                        {!isReadMode && (
                            <IconButton
                                onClick={() =>
                                    openModal(
                                        TYPE_MODAL_RELEASE.DETAIL_TRACK_RELEASE,
                                        {
                                            trackId: record?.id,
                                            index,
                                        }
                                    )
                                }
                            >
                                <SquarePen size={SIZE_ICON} />
                            </IconButton>
                        )}
                        <TrackActionButton
                            // disabled={isReadMode}
                            showDelete={!isReadMode}
                            showDownload
                            onShowDetail={() => {
                                router.push(
                                    getTrackDetailRoute(
                                        record?.id,
                                        TRACK_TABS.METADATA
                                    )
                                );
                            }}
                            onShowDelete={() =>
                                openModal(TYPE_MODAL_TRACK.DELETE, record)
                            }
                            onShowDownload={async () => {
                                const response =
                                    await bucketApi.getLinkDownloadFile(
                                        record?.audioFile?.fileId as string
                                    );
                                window.open(response?.data?.data);
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full">
            <SortableTable
                key="main"
                {...props}
                pagination={false}
                columns={columns}
                rowClassName={() => 'group'}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
}
