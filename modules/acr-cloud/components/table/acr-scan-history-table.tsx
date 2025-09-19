import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SCAN_STATUS } from '../../enums';
import { useCancelScan } from '../../hooks/use-cancel-scan';
import { useReScan } from '../../hooks/use-re-scan';
import { TrackScanStatusData, TrackScanStatusDataFilter } from '../../types';
import AcrCloudScanDetailModal from '../modal/acr-scan-detail-modal';
import TagTrackScanStatus from '../tags/tag-track-scan-status';
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
                    <CustomTooltip title={messages('common.viewDetail')}>
                        <span
                            className="cursor-pointer truncate hover:text-blue-500 hover:underline"
                            onClick={() => handleOpenModal(record)}
                        >
                            {record?.creator?.name}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        // {
        //     title: messages('track.label'),
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
            width: 30,
            align: 'center',
            render: (_, record) => (
                <TagTrackScanStatus status={record?.status} />
            ),
        },
        {
            title: messages('track.totalTrackNeedScan'),
            key: 'trackNeedScanCount',
            width: 50,
            align: 'center',
            render: (_, record) => (
                <p className="truncate">{record?.trackNeedScanIds?.length}</p>
            ),
        },
        {
            title: messages('track.numberOfTracksScanned'),
            key: 'trackScannedCount',
            width: 50,
            align: 'center',
            render: (_, record) => (
                <p className="truncate">{record?.trackScannedIds?.length}</p>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
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
                const isShowCancel = record?.status == SCAN_STATUS.RUNNING;
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
