'use client';

import { DATE_FORMAT } from '@/enums/common';
import { RELEASE_REVIEW_STATUS } from '@/modules/releases/enums';
import { useGetReleaseReviews } from '@/modules/releases/hooks/use-get-release-reviews';
import { Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ReviewHistoryModalProps {
    releaseId: string;
    open: boolean;
    onCancel: () => void;
}

export default function ReviewHistoryModal({
    releaseId,
    open,
    onCancel,
}: ReviewHistoryModalProps) {
    const messages = useTranslations();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Lấy lịch sử duyệt (chỉ query khi modal open nhờ destroyOnClose ở Modal)
    const { releaseReviewsData, isLoading } = useGetReleaseReviews({
        releaseId,
        page,
        pageSize,
    });

    const columns = [
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: RELEASE_REVIEW_STATUS) => {
                let color = 'default';
                let label: string = status;
                switch (status) {
                    case RELEASE_REVIEW_STATUS.COMPLETED:
                        color = 'success';
                        label = messages('status.approved');
                        break;
                    case RELEASE_REVIEW_STATUS.FAILED:
                        color = 'error';
                        label = messages('status.reject');
                        break;
                    case RELEASE_REVIEW_STATUS.PROCESSING:
                        color = 'processing';
                        label = messages('common.processing');
                        break;
                    case RELEASE_REVIEW_STATUS.PENDING:
                        color = 'warning';
                        label = messages('status.pending');
                        break;
                    case RELEASE_REVIEW_STATUS.CANCEL:
                        color = 'default';
                        label = messages('common.cancel');
                        break;
                }
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: messages('common.reviewer'),
            dataIndex: 'reviewer',
            key: 'reviewer',
            width: 180,
            render: (reviewer: any) => reviewer?.name || reviewer?.email || '-',
        },
        {
            title: messages('common.note'),
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => note || '-',
        },
        {
            title: messages('common.updatedAt'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (updatedAt: string) =>
                updatedAt
                    ? dayjs(updatedAt).format(DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
    ];

    return (
        <Modal
            title={messages('release.systemReview.historyTitle')}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={'50vw'}
            destroyOnClose
        >
            <Table
                columns={columns}
                dataSource={releaseReviewsData?.items || []}
                loading={isLoading}
                rowKey="id"
                scroll={{
                    y: 500,
                }}
                pagination={{
                    style: {
                        marginRight: 20,
                    },
                    current: page,
                    pageSize: pageSize,
                    total: releaseReviewsData?.metadata?.totalItems || 0,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    onChange: (currentPage, currentPageSize) => {
                        setPage(currentPage);
                        setPageSize(currentPageSize);
                    },
                }}
                size="middle"
                className="mt-4 overflow-hidden rounded-lg border"
            />
        </Modal>
    );
}
