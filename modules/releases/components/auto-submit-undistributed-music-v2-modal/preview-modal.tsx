'use client';

import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleaseDspStatusTag from '@/modules/release-dsp/components/release-dsp-status-tag';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Button, Modal, Popover, Tag } from 'antd';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ReleasesData } from '../../types';

interface PreviewSubmitModalProps {
    previewRecord: ReleasesData | null;
    previewData: any;
    onCancel: () => void;
}

const getPreviewDataSource = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.releaseDspDeliveries))
        return data.releaseDspDeliveries;
    if (Array.isArray(data?.data)) return data.data;
    return data ? [data] : [];
};

const getSubmitData = (data: any) => data?.submitData ?? data?.data?.submitData;

const getPreviewRowKey = (record: any) =>
    record?.id ?? record?.dsp?.id ?? record?.dspCode;

const hasTargetStatus = (record: any) => !!record?.targetStatus;

export default function PreviewSubmitModal({
    previewRecord,
    previewData,
    onCancel,
}: PreviewSubmitModalProps) {
    const messages = useTranslations();

    const previewColumns: ProColumns<any>[] = useMemo(
        () => [
            {
                title: messages('common.iNo'),
                key: 'iNo',
                width: 60,
                align: 'center',
                fixed: 'left',
                render: (_, __, index) => index + 1,
            },
            {
                title: messages('distribution.digitalServiceProviders'),
                dataIndex: 'dsp.name',
                key: 'dsp.name',
                fixed: 'left',
                width: 260,
                render: (_, record) => {
                    const isLocked =
                        record?.isActive === false ||
                        record?.dsp?.isActive === false;

                    return (
                        <div className="flex items-center gap-2">
                            {record?.dsp?.picture && (
                                <Avatar
                                    src={record.dsp.picture}
                                    alt={record?.dsp?.name}
                                    className="h-6 w-6 rounded-full object-cover"
                                />
                            )}
                            <span className="font-semibold">
                                {record?.dsp?.name ?? record?.dspCode ?? '-'}
                            </span>
                            {isLocked && (
                                <CustomTooltip title={messages('release.autoSubmitV2.dspLockedTooltip')}>
                                    <Lock size={16} className="text-gray-400" />
                                </CustomTooltip>
                            )}
                        </div>
                    );
                },
            },
            {
                title: messages('distribution.hasLiveVersion'),
                key: 'hasLiveVersion',
                dataIndex: 'hasLiveVersion',
                width: 150,
                render: (_, record) => (
                    <Tag color={record?.hasLiveVersion ? 'success' : 'default'}>
                        {record?.hasLiveVersion ? messages('release.autoSubmitV2.live') : messages('release.autoSubmitV2.notLive')}
                    </Tag>
                ),
            },
            {
                title: messages('release.autoSubmitV2.currentStatus'),
                key: 'status',
                dataIndex: 'status',
                width: 180,
                render: (_, record) =>
                    record?.status ? (
                        <ReleaseDspStatusTag status={record.status} />
                    ) : (
                        '-'
                    ),
            },
            {
                title: messages('release.autoSubmitV2.targetStatus'),
                key: 'targetStatus',
                dataIndex: 'targetStatus',
                width: 180,
                render: (_, record) =>
                    record?.targetStatus ? (
                        <ReleaseDspStatusTag status={record.targetStatus} />
                    ) : (
                        '-'
                    ),
            },
        ],
        [messages]
    );

    return (
        <Modal
            title={
                <div className="flex items-center justify-between gap-3 pr-8">
                    <span>
                        {previewRecord
                            ? `${messages('release.autoSubmitV2.previewData')} - ${previewRecord.title}`
                            : messages('release.autoSubmitV2.previewData')}
                    </span>
                    {getSubmitData(previewData) && (
                        <Popover
                            trigger="click"
                            placement="bottomRight"
                            title={messages('release.autoSubmitV2.dataSubmit')}
                            content={
                                <pre className="max-h-[60vh] max-w-[520px] overflow-auto rounded bg-gray-50 p-3 text-xs">
                                    {JSON.stringify(
                                        getSubmitData(previewData),
                                        null,
                                        2
                                    )}
                                </pre>
                            }
                        >
                            <Button size="small">{messages('release.autoSubmitV2.dataSubmit')}</Button>
                        </Popover>
                    )}
                </div>
            }
            open={!!previewRecord && !!previewData}
            onCancel={onCancel}
            footer={null}
            width="80vw"
            centered
        >
            <AppProTable
                dataSource={getPreviewDataSource(previewData)}
                rowKey={getPreviewRowKey}
                columns={previewColumns}
                rowClassName={(record: any) =>
                    hasTargetStatus(record)
                        ? 'bg-blue-50/60'
                        : 'bg-gray-50 opacity-45'
                }
                pagination={false}
                options={false}
                search={false}
                tableAlertRender={false}
                tableAlertOptionRender={false}
                scroll={{
                    x: '70vw',
                    y: '50vh',
                }}
            />
        </Modal>
    );
}
