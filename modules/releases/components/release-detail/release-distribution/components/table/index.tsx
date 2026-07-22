import IconButton from '@/components/ui/button/icon-button';
import JsonViewer from '@/components/ui/json-viewer';
import AppModal from '@/components/ui/modal/normal-modal';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE, SIZE_ICON } from '@/constants/common';
import { getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import ReleaseDspStatusTag from '@/modules/release-dsp/components/release-dsp-status-tag';
import {
    ReleaseDspData,
    ReleaseDspDataFilter,
} from '@/modules/release-dsp/types';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Space, Tag } from 'antd';
import { Box, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = Omit<AppProTableProps<ReleaseDspData>, 'columns'> & {
    dataFilter?: ReleaseDspDataFilter;
    pagination?: {
        current: number;
        pageSize: number;
    };
};

export default function DistributionTable({
    dataFilter,
    pagination,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const releaseAction = useReleaseActionStore((state) => state.action);
    const isEditMode = releaseAction === RELEASE_DETAIL_ACTION.EDIT;
    const { isDark } = useThemeMode();

    const [issueModal, setIssueModal] = useState<{
        open: boolean;
        data: ReleaseDspData['issues'];
    }>({
        open: false,
        data: null,
    });

    const column: ProColumns<ReleaseDspData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                ((pagination?.current || 1) - 1) *
                    (pagination?.pageSize || 999) +
                index +
                1,
        },
        {
            title: messages('distribution.digitalServiceProviders'),
            dataIndex: 'dsp.name',
            key: 'dsp.name',
            width: 250,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'dsp.name'
            ),
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <Avatar
                                src={record?.dsp?.picture ?? FALLBACK_IMAGE}
                                alt="thumbnail"
                                size={32}
                            />
                        </div>
                        <span className="font-bold">{record?.dsp?.name}</span>
                        {!record?.isActive && !record?.dsp?.isActive && (
                            <CustomTooltip
                                title={messages('distribution.inactiveDsp')}
                            >
                                <Lock size={16} className="text-gray-400" />
                            </CustomTooltip>
                        )}
                    </div>
                );
            },
        },
        // {
        //     title: messages('distribution.lastEnqueue'),
        //     key: 'releaseDspDelivery.lastEnqueuedAt',
        //     dataIndex: 'releaseDspDelivery.lastEnqueuedAt',
        //     align: 'left',
        //     width: 250,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter?.orderBy,
        //         dataFilter?.fieldOrder,
        //         'releaseDspDelivery.lastEnqueuedAt'
        //     ),
        //     render: (value, record) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(record?.lastEnqueuedAt)}{' '}
        //         </span>
        //     ),
        // },
        // {
        //     title: 'Last Delivered',
        //     key: 'releaseDspDelivery.lastDeliveredAt',
        //     dataIndex: 'releaseDspDelivery.lastDeliveredAt',
        //     align: 'left',
        //     width: 250,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter?.orderBy,
        //         dataFilter?.fieldOrder,
        //         'releaseDspDelivery.lastDeliveredAt'
        //     ),
        //     render: (value, record) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(record?.lastDeliveredAt)}{' '}
        //         </span>
        //     ),
        // },
        {
            title: messages('distribution.hasLiveVersion'),
            key: 'hasLiveVersion',
            dataIndex: 'hasLiveVersion',
            align: 'left',
            width: 200,
            render: (value, record) => {
                return (
                    <Tag color={record.hasLiveVersion ? 'success' : 'default'}>
                        {record.hasLiveVersion
                            ? messages('release.live')
                            : messages('release.notLive')}
                    </Tag>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 200,
            render: (value, record) => {
                if (record?.status === RELEASE_DSP_DELIVERY_STATUS.ISSUES) {
                    return (
                        <CustomTooltip
                            title={
                                record?.issues
                                    ? messages('common.viewDetail')
                                    : ''
                            }
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!record?.issues) return;
                                    setIssueModal({
                                        open: true,
                                        data: record?.issues,
                                    });
                                }}
                                className="inline-block cursor-pointer"
                            >
                                <ReleaseDspStatusTag
                                    status={record?.status}
                                    className="hover:opacity-70"
                                />
                            </div>
                        </CustomTooltip>
                    );
                }
                return <ReleaseDspStatusTag status={record?.status} />;
            },
        },
        {
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 100,
            onCell: (record) => ({
                className: record.isActive === false ? '!bg-zinc-50' : '',
            }),
            render: (value, record) => {
                if (!isEditMode || record?.isActive === false) return;
                return (
                    <PermissionGate
                        permission={PERMISSION.RELEASE_AUDIO.UPDATE}
                    >
                        <Space>
                            {isEditMode && (
                                <CustomTooltip
                                    title={messages('distribute.label')}
                                >
                                    <IconButton
                                        onClick={() =>
                                            openModal(
                                                TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION,
                                                record
                                            )
                                        }
                                    >
                                        <Box size={SIZE_ICON} />
                                    </IconButton>
                                </CustomTooltip>
                            )}
                        </Space>
                    </PermissionGate>
                );
            },
        },
    ];

    return (
        <>
            <AppProTable
                {...props}
                pagination={false}
                columns={column}
                rowClassName={(record) =>
                    !record.isActive && !record.dsp?.isActive
                        ? 'bg-zinc-50 opacity-50'
                        : 'group cursor-pointer'
                }
            />

            <AppModal
                open={issueModal.open}
                onCancel={() => setIssueModal({ open: false, data: null })}
                title={messages('common.issues')}
                footer={null}
                width={'60vw'}
                styles={{
                    body: {
                        height: 'calc(100vh - 140px)',
                        overflowY: 'auto',
                    },
                }}
                centered
            >
                {issueModal.data && (
                    <JsonViewer
                        src={issueModal.data}
                        theme={isDark ? 'ocean' : 'rjv-default'}
                        style={{
                            height: 'calc(100vh - 150px)',
                            overflowY: 'auto',
                        }}
                    />
                )}
            </AppModal>
        </>
    );
}
