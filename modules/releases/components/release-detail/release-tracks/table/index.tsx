'use client';
import IconButton from '@/components/ui/button/icon-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { SIZE_ICON } from '@/constants/common';
import { getIndex } from '@/helpers/common';
import { getTrackDetailRoute, RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
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
import { Input, Tag, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { debounce } from 'lodash';
import { SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import TrackActionButton from '../button/track-action';
import { TrackWaveform } from '../track-wave-form';

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
    const { action } = useGetReleaseDetailRoute();
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
        }, 800),
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
                    <div className="">
                        <TrackWaveform
                            key={`${record.id}-${index}`}
                            data={record}
                        />
                    </div>
                );
            },
        },
        {
            title: `${messages('track.label')} / ${messages('artist.label')}`,
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            width: 350,
            ellipsis: true,
            render: (value, record) => {
                return (
                    <div className="space-y-2">
                        <Typography.Paragraph
                            editable={
                                isReadMode
                                    ? false
                                    : {
                                          onChange(value) {
                                              if (value === record.title)
                                                  return;
                                              if (value.length < 1) {
                                                  return showNotification(
                                                      'error',
                                                      messages(
                                                          'validation.min',
                                                          {
                                                              number: 1,
                                                          }
                                                      )
                                                  );
                                              }
                                              debouncedUpdate(record.id, {
                                                  title: value,
                                              });
                                          },
                                      }
                            }
                            className="!mb-0"
                        >
                            {record?.title}
                        </Typography.Paragraph>
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
                                        closable={!isReadMode}
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
            dataIndex: 'ISRC',
            key: 'ISRC',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value, record) => {
                return (
                    <Input
                        variant="filled"
                        disabled={isReadMode}
                        size="small"
                        defaultValue={record?.isrc ?? ''}
                        onCopy={(e) => {}}
                    />
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
            width: 80,
            render: (value, record, index) => {
                return (
                    <div className="flex items-center gap-2">
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
                        <TrackActionButton
                            // disabled={isReadMode}
                            showDelete={!isReadMode}
                            showDownload
                            showDetail
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
