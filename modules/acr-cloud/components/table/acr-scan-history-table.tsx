import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TRACK_SCAN_STATUS } from '../../enums';
import { useCancelScan } from '../../hooks/use-cancel-scan';
import { useReScan } from '../../hooks/use-re-scan';
import { TrackScanStatusData, TrackScanStatusDataFilter } from '../../types';
import AcrCloudScanDetailModal from '../modal/acr-scan-detail-modal';
import TagScanStatus from '../tags/tag-scan-status';
import ScanStatusAction from './scan-status-action-button';

type Props = Omit<AppTableProps<TrackScanStatusData>, 'columns'> & {
    dataFilter: TrackScanStatusDataFilter;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export interface OpenModal {
    open: boolean;
    data: TrackScanStatusData | null;
}

export default function AcrScanHistoryTable({ ...props }: Props) {
    const [openModal, setOpenModal] = useState<OpenModal>({
        open: false,
        data: null,
    });
    const messages = useTranslations();
    const { cancelScan } = useCancelScan();
    const { reScan } = useReScan();

    const handleOpenModal = (record: TrackScanStatusData) => {
        setOpenModal({
            open: true,
            data: record,
        });
    };

    const handleCloseModal = () => {
        setOpenModal({
            open: false,
            data: null,
        });
    };

    const columns: ColumnType<TrackScanStatusData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('common.creator'),
            key: 'creator',
            width: 80,
            align: 'left',
            render: (_, record) => (
                <div className="space-x-1">
                    <Avatar src={record?.creator?.avatar} />
                    <span className="truncate">{record?.creator?.name}</span>
                </div>
            ),
        },
        // {
        //     title: messages('tracks.label'),
        //     key: 'tracks',
        //     width: 100,
        //     align: 'left',
        //     render: (_, record) => (
        //         <PopoverTags
        //             tags={record?.tracksToScan?.map((item) => item.title)}
        //             maxVisibleTags={2}
        //         />
        //     ),
        // },
        {
            title: messages('common.status'),
            key: 'status',
            width: 50,
            align: 'center',
            render: (_, record) => <TagScanStatus status={record?.status} />,
        },
        {
            title: messages('tracks.totalTrackNeedScan'),
            key: 'trackNeedScanCount',
            width: 50,
            align: 'center',
            render: (_, record) => (
                <p className="truncate">{record?.trackNeedScanIds?.length}</p>
            ),
        },
        {
            title: messages('tracks.numberOfTracksScanned'),
            key: 'trackScannedCount',
            width: 50,
            align: 'center',
            render: (_, record) => (
                <p className="truncate">{record?.trackScannedIds?.length}</p>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            width: 50,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.createdAt)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 20,
            fixed: 'right',
            render: (_, record) => {
                const isShowCancel =
                    record?.status == TRACK_SCAN_STATUS.RUNNING;
                return (
                    <ScanStatusAction
                        showCancel={isShowCancel}
                        showScan
                        showDetail
                        onShowDetail={() => handleOpenModal(record)}
                        onShowCancel={() => {
                            cancelScan({ id: record?.id });
                        }}
                        onShowScan={() => {
                            reScan({ id: record?.id });
                        }}
                    />
                );
            },
        },
    ];
    return (
        <>
            <AppTable {...props} pagination={false} columns={columns} />
            <AcrCloudScanDetailModal
                open={openModal.open}
                data={openModal.data}
                onCancel={handleCloseModal}
            />
        </>
    );
}
