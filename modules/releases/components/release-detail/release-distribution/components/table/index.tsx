import IconButton from '@/components/ui/button/icon-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE, SIZE_ICON } from '@/constants/common';
import { formattedDate, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
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
import { Avatar, Space } from 'antd';
import { Box } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = Omit<AppProTableProps<ReleaseDspData>, 'columns'> & {
    currentPage?: number;
    dataFilter?: ReleaseDspDataFilter;
};

export default function DistributionTable({
    currentPage = 1,
    dataFilter,
    ...props
}: Props) {
    const pageSize =
        typeof props.pagination === 'object'
            ? (props.pagination?.pageSize ?? 10)
            : 10;
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const releaseAction = useReleaseActionStore((state) => state.action);
    const isEditMode = releaseAction === RELEASE_DETAIL_ACTION.EDIT;

    const column: ProColumns<ReleaseDspData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 80,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
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
                    </div>
                );
            },
        },
        {
            title: messages('distribution.lastEnqueue'),
            key: 'releaseDspDelivery.lastEnqueuedAt',
            dataIndex: 'releaseDspDelivery.lastEnqueuedAt',
            align: 'left',
            width: 250,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'releaseDspDelivery.lastEnqueuedAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.lastEnqueuedAt)}{' '}
                </span>
            ),
        },
        {
            title: 'Last Delivered',
            key: 'releaseDspDelivery.lastDeliveredAt',
            dataIndex: 'releaseDspDelivery.lastDeliveredAt',
            align: 'left',
            width: 250,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'releaseDspDelivery.lastDeliveredAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.lastDeliveredAt)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 250,
            render: (value, record) => {
                if (record?.status === RELEASE_DSP_DELIVERY_STATUS.ISSUES) {
                    return (
                        <CustomTooltip title={messages('common.viewDetail')}>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.ISSUES,
                                        record?.issues
                                    );
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
            render: (value, record) => {
                if (!isEditMode) return;
                return (
                    <PermissionGate permission={PERMISSION.RELEASE.UPDATE}>
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
        <AppProTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
}
