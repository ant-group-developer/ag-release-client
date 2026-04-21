'use client';
import IconButton from '@/components/ui/button/icon-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { SIZE_ICON } from '@/constants/common';
import { getIndex, getSortOrder } from '@/helpers/common';
import { getTrackDetailRoute, RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { TYPE_MODAL_RELEASE, TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { TRACK_SORT_FIELD, TRACK_TABS } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { useUpdateTrackOrder } from '@/modules/tracks/hooks/use-update-track-order';
import { TrackData, TrackDataFilter } from '@/modules/tracks/types';

import { UpdateTrackOrderPayload } from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Barcode, Music, SquarePen, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import TrackActionButton from '../button/track-action';
import { TrackSliderPlayer } from '../track-slider-player';
import { TrackArtists } from './track-artists';
import { EditableIsrc } from './track-edit-isrc';
import { EditableTitle } from './track-edit-title';

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter?: TrackDataFilter;
} & Omit<SortableTableProps<TrackData>, 'columns'>;

export default function ReleaseTracksTable({ dataFilter, ...props }: Props) {
    // hooks - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);
    // const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const action = useReleaseActionStore((s) => s.action);
    const router = useRouter();

    // apis
    const { mutate: updateTrackDraft } = useUpdateTrackDraft();
    const handleUpdateTrack = useCallback(
        (variables: any) => {
            updateTrackDraft(variables);
        },
        [updateTrackDraft]
    );

    const { updateTrackOrder } = useUpdateTrackOrder();
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );

    // const
    const isReadMode = action !== RELEASE_DETAIL_ACTION.EDIT;
    const { hasPermission } = usePermission();
    const canUpdate = hasPermission(PERMISSION.RELEASE.UPDATE);

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

    const columns: ColumnType<TrackData>[] = [
        ...(canUpdate && !isReadMode
            ? [
                  {
                      key: 'sort',
                      width: 30,
                      align: 'center' as const,
                  },
              ]
            : []),
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
                        <TrackSliderPlayer
                            key={`${record.id}-${index}`}
                            data={record}
                        />
                    </div>
                );
            },
        },
        {
            title: (
                <span className="flex items-center gap-1">
                    <Music size={SIZE_ICON} />
                    {messages('track.label')}
                </span>
            ),
            dataIndex: TRACK_SORT_FIELD.TITLE,
            key: 'title',
            align: 'left',
            width: 300,
            ellipsis: true,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                TRACK_SORT_FIELD.TITLE
            ),
            render: (_, record) => {
                return (
                    <EditableTitle
                        record={record}
                        isReadMode={isReadMode}
                        onUpdate={handleUpdateTrack}
                        messages={messages}
                    />
                );
            },
        },
        {
            title: (
                <span className="flex items-center gap-1">
                    <Users size={SIZE_ICON} />
                    {messages('artist.label')}
                </span>
            ),
            align: 'left',
            dataIndex: 'artist',
            width: 250,
            render: (_, record) => {
                return (
                    <TrackArtists
                        record={record}
                        isReadMode={isReadMode}
                        openModal={openModal}
                    />
                );
            },
        },
        {
            title: (
                <span className="flex items-center gap-1">
                    <Barcode size={SIZE_ICON} />
                    ISRC
                </span>
            ),
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
                        onUpdate={handleUpdateTrack}
                    />
                );
            },
        },
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 120,
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
                            ? messages('common.incomplete')
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
