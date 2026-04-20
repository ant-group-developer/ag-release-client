import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getTrackDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import TrackActionButton from '@/modules/releases/components/release-detail/release-tracks/button/track-action';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import {
    SCAN_COPYRIGHT_STATUS,
    TRACK_SORT_FIELD,
    TRACK_TABS,
    TRACKS_COLUMNS_DISPLAY,
} from '@/modules/tracks/enums';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { ProColumns } from '@ant-design/pro-components';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import nProgress from 'nprogress';
import { TrackData, TrackDataFilter } from '../../types';
import TagScanCopyright from '../tags/tag-scan-coppyright';
import TrackCoverArt from './trackCoverArt';

type Props = Omit<AppProTableProps<TrackData>, 'columns'> & {
    dataFilter: TrackDataFilter;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function TracksTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();
    const params = useParams();
    const { token } = theme.useToken();
    const { hasPermission } = usePermission();
    const canScan = hasPermission(PERMISSION.TRACK.SCAN);
    const column: ProColumns<TrackData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('track.name'),
            key: 'title',
            dataIndex: TRACK_SORT_FIELD.TITLE,
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TRACK_SORT_FIELD.TITLE
            ),
            render: (_, record) => {
                const trackArtist = record?.trackArtists ?? [];
                const trackName = trackArtist
                    ?.map((item) => item?.artist?.name)
                    ?.join(' & ');
                return (
                    <div className="flex items-center gap-4">
                        <TrackCoverArt trackData={record} />
                        <div className="truncate">
                            <CustomTooltip
                                title={messages('common.viewDetail')}
                            >
                                <Link
                                    href={getTrackDetailRoute(
                                        record?.id,
                                        TRACK_TABS.METADATA
                                    )}
                                    className="block truncate hover:cursor-pointer hover:text-blue-500 hover:underline"
                                >
                                    {record?.title}
                                </Link>
                            </CustomTooltip>
                            <span className="truncate text-gray-500">
                                {trackName}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('release.version'),
            key: 'version',
            dataIndex: 'version',
            align: 'left',
            width: 50,
            render: (value, record) => {
                return <span className="truncate"> {record.version} </span>;
            },
        },
        {
            title: messages('track.id'),
            key: 'id',
            dataIndex: 'id',
            align: 'left',
            width: 60,
            render: (value, record) => (
                <CopyText text={record?.id}>
                    <span className="truncate"> {value} </span>
                </CopyText>
            ),
        },
        {
            title: messages('release.label'),
            key: TRACKS_COLUMNS_DISPLAY.RELEASE_TITLE,
            dataIndex: 'releaseTitle',
            align: 'left',
            width: 80,
            ellipsis: true,
            render: (_, record) => (
                <CopyText text={record?.release?.title}>
                    <span className="truncate"> {record?.release?.title} </span>
                </CopyText>
            ),
        },
        {
            title: messages('label.label'),
            key: TRACKS_COLUMNS_DISPLAY.LABEL_NAME,
            dataIndex: 'labelName',
            align: 'left',
            width: 80,
            ellipsis: true,
            render: (_, record) => (
                <CopyText text={record?.release?.label?.name}>
                    <span className="truncate">
                        {' '}
                        {record?.release?.label?.name}{' '}
                    </span>
                </CopyText>
            ),
        },
        {
            title: 'ISRC',
            key: 'isrc',
            dataIndex: 'isrc',
            align: 'left',
            width: 80,
            render: (_, record) => (
                <CopyText text={record?.isrc as string}>
                    <span className="truncate"> {record?.isrc} </span>
                </CopyText>
            ),
        },
        {
            title: 'ACRCloud',
            key: 'acrCloud',
            dataIndex: 'acrCloud',
            align: 'left',
            width: 80,
            render: (value, record) => {
                const isUnScanned =
                    record?.scanCopyrightStatus ==
                    SCAN_COPYRIGHT_STATUS.UN_SCANNED;
                return (
                    <div>
                        <TagScanCopyright
                            className="!border-0 hover:cursor-pointer hover:opacity-70"
                            onClick={() => {
                                if (isUnScanned) {
                                    if (canScan) {
                                        return openModal(
                                            TYPE_MODAL_TRACK.ACR_CLOUD_SCAN,
                                            record
                                        );
                                    }
                                    return;
                                }
                                openModal(
                                    TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT,
                                    record
                                );
                            }}
                            status={record?.scanCopyrightStatus}
                        />
                    </div>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: TRACK_SORT_FIELD.CREATED_AT,
            align: 'left',
            width: 80,
            sorter: true,
            defaultSortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TRACK_SORT_FIELD.CREATED_AT
            ),
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.createdAt)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 30,
            fixed: 'right',
            render: (_, record) => {
                const isUnScanned =
                    record?.scanCopyrightStatus ==
                    SCAN_COPYRIGHT_STATUS.UN_SCANNED;
                return (
                    <TrackActionButton
                        showDownload
                        showDetail
                        showScan={canScan}
                        showScanResult={!isUnScanned}
                        onShowScanResult={() =>
                            openModal(
                                TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT,
                                record
                            )
                        }
                        onShowScan={() =>
                            openModal(TYPE_MODAL_TRACK.ACR_CLOUD_SCAN, record)
                        }
                        onShowDetail={() => {
                            nProgress.start();
                            router.push(
                                getTrackDetailRoute(
                                    record?.id,
                                    TRACK_TABS.METADATA
                                )
                            );
                        }}
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

    return (
        <AppProTable
            headerTitle={messages('track.list')}
            tableAlertRender={({
                selectedRowKeys,
                selectedRows,
                onCleanSelected,
            }) => (
                <div className="flex items-center gap-2 font-semibold">
                    <div className="space-x-1">
                        <span>{selectedRowKeys.length}</span>
                        <span>{messages('common.selected')}</span>
                    </div>
                    <Button
                        type="primary"
                        onClick={() =>
                            openModal(TYPE_MODAL_TRACK.ACR_CLOUD_SCAN)
                        }
                    >
                        {messages('track.scan')}
                    </Button>
                </div>
            )}
            columnsState={{
                persistenceKey: 'tracks-table-columns',
                persistenceType: 'sessionStorage',
            }}
            {...props}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
}
