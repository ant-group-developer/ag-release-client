import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppTable from '@/components/ui/table/normal-table';
import useModalStore from '@/hooks/use-modal';
import { Spin, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TRACK_SCAN_STATUS } from '../../enums';
import { useGetDetailScanStatus } from '../../hooks/use-get-scan-status-detail';
import { TrackScanStatusData } from '../../types';
import TagScanStatus from '../tags/tag-scan-status';

type Props = Omit<AppModalProps, 'children'> & {
    data: TrackScanStatusData | null;
};

export enum TRACK_ITEM_STATUS {
    NEED_SCAN = 'needScan',
    SCANNED = 'scanned',
}

type MergedTrackItem = {
    id: string;
    title: string;
    status: TRACK_ITEM_STATUS;
};

export default function AcrCloudScanDetailModal({ data, ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);

    const { scanStatusData, isFetching } = useGetDetailScanStatus(
        data?.id as string
    );

    const mergedTracks = useMemo(() => {
        if (!scanStatusData) return [];

        const tracks: MergedTrackItem[] = [];
        const trackNeedScan = scanStatusData?.trackNeedScan ?? [];
        const trackScanned = scanStatusData?.trackScanned ?? [];

        if (trackNeedScan) {
            trackNeedScan.forEach((track: any) => {
                const isTrackScanned =
                    !!scanStatusData?.trackScannedIds?.includes(track.id);
                if (isTrackScanned) return;
                tracks.push({
                    id: track?.id,
                    title: track?.title,
                    status: TRACK_ITEM_STATUS.NEED_SCAN,
                });
            });
        }
        if (trackScanned) {
            trackScanned.forEach((track: any) => {
                tracks.push({
                    id: track?.id,
                    title: track?.title,
                    status: TRACK_ITEM_STATUS.SCANNED,
                });
            });
        }
        return tracks;
    }, [scanStatusData]);

    const column: ColumnType<MergedTrackItem>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 20,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('tracks.label'),
            key: 'track',
            width: 100,
            align: 'left',
            render: (_, record) => <span> {record?.title} </span>,
        },
        {
            title: messages('common.status'),
            key: 'status',
            width: 50,
            align: 'center',
            render: (_, record) => {
                const statusLabel =
                    record?.status === TRACK_ITEM_STATUS.NEED_SCAN
                        ? messages('common.notScanned')
                        : messages('common.scanned');
                const color =
                    record?.status === TRACK_ITEM_STATUS.NEED_SCAN
                        ? 'blue'
                        : 'green';
                return <Tag color={color}> {statusLabel} </Tag>;
            },
        },
    ];

    const titleModal = () => {
        return (
            <div className="space-x-2">
                <span>
                    {messages('common.detail')}{' '}
                    {messages('common.scan').toLowerCase()} ACRCloud
                </span>
                <TagScanStatus status={data?.status as TRACK_SCAN_STATUS} />
            </div>
        );
    };

    return (
        <AppModal
            open
            className="!top-34"
            title={titleModal()}
            onCancel={closeModal}
            width={800}
            height={800}
            footer={null}
            {...props}
        >
            <Spin spinning={isFetching}>
                <div className="max-h-[600px] min-h-[300px] overflow-hidden">
                    <AppTable
                        columns={column}
                        dataSource={mergedTracks}
                        scroll={{ x: 'max-content', y: 550 }}
                    />
                </div>
            </Spin>
        </AppModal>
    );
}
