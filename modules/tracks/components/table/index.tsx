import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SCREEN } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import TrackActionButton from '@/modules/releases/components/release-detail/release-tracks/button/track-action';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import {
    SCAN_COPYRIGHT_STATUS,
    TRACK_TABS,
    TRACKS_COLUMNS_DISPLAY,
    TRACKS_TABLE_KEY,
} from '@/modules/tracks/enums';
import { getTrackDetailRoute } from '@/modules/tracks/helpers/link';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { ProColumns } from '@ant-design/pro-components';
import { Button, theme, Typography } from 'antd';
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
    const isMobile = useIsMobile();

    const column: ProColumns<TrackData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: isMobile ? undefined : 'left',
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
            dataIndex: TRACKS_TABLE_KEY.TITLE,
            ellipsis: true,
            align: 'left',
            fixed: isMobile ? undefined : 'left',
            width: isMobile ? 220 : 280,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TRACKS_TABLE_KEY.TITLE
            ),
            render: (_, record) => {
                const trackArtist = record?.trackArtists ?? [];
                const trackName = trackArtist
                    ?.map((item) => item?.artist?.name)
                    ?.filter(Boolean)
                    ?.join(' & ');
                return (
                    <div className="flex min-w-0 items-center gap-3">
                        <TrackCoverArt trackData={record} />
                        <div className="min-w-0 flex-1 flex-col justify-center overflow-hidden">
                            <div className="max-w-[140px] truncate sm:max-w-[200px]">
                                <CustomTooltip title={record?.title}>
                                    <Link
                                        href={getTrackDetailRoute(
                                            record?.id,
                                            TRACK_TABS.METADATA
                                        )}
                                    >
                                        <Typography.Text
                                            strong
                                            ellipsis
                                            className="cursor-pointer hover:underline"
                                        >
                                            {record?.title}
                                        </Typography.Text>
                                    </Link>
                                </CustomTooltip>
                            </div>
                            {trackName && (
                                <div className="max-w-[140px] truncate sm:max-w-[200px]">
                                    <CustomTooltip title={trackName}>
                                        <Typography.Text
                                            type="secondary"
                                            ellipsis
                                            className="block"
                                        >
                                            {trackName}
                                        </Typography.Text>
                                    </CustomTooltip>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('release.version'),
            key: 'version',
            dataIndex: TRACKS_TABLE_KEY.VERSION,
            align: 'left',
            width: 80,
            render: (value, record) => {
                return <span className="truncate"> {record.version} </span>;
            },
        },
        {
            title: messages('track.id'),
            key: 'id',
            dataIndex: TRACKS_TABLE_KEY.ID,
            align: 'left',
            width: 90,
            render: (value, record) => (
                <CopyText text={record?.id}>
                    <span className="truncate"> {value} </span>
                </CopyText>
            ),
        },
        {
            title: messages('release.label'),
            key: TRACKS_COLUMNS_DISPLAY.RELEASE_TITLE,
            dataIndex: TRACKS_TABLE_KEY.RELEASE_TITLE,
            align: 'left',
            width: 140,
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
            dataIndex: TRACKS_TABLE_KEY.LABEL_NAME,
            align: 'left',
            width: 120,
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
            dataIndex: TRACKS_TABLE_KEY.ISRC,
            align: 'left',
            width: 140,
            render: (_, record) => (
                <CopyText text={record?.isrc as string}>
                    <span className="truncate"> {record?.isrc} </span>
                </CopyText>
            ),
        },
        {
            title: 'ACRCloud',
            key: 'acrCloud',
            dataIndex: TRACKS_TABLE_KEY.ACR_CLOUD,
            align: 'left',
            width: 120,
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
            dataIndex: TRACKS_TABLE_KEY.CREATED_AT,
            align: 'left',
            width: 150,
            sorter: true,
            defaultSortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TRACKS_TABLE_KEY.CREATED_AT
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
            width: isMobile ? 50 : 60,
            fixed: isMobile ? undefined : 'right',
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
                persistenceKey: isMobile
                    ? undefined
                    : 'tracks-table-columns-v2',
                persistenceType: 'sessionStorage',
            }}
            {...props}
            scroll={{
                x: isMobile ? 'max-content' : SCREEN.XL,
                ...props?.scroll,
            }}
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
