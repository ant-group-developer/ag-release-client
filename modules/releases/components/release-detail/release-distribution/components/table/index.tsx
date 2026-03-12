import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import {
    ReleaseDspData,
    ReleaseDspDataFilter,
} from '@/modules/release-dsp/types';
import ReleaseStatusTag from '@/modules/releases/components/tag/release-status-tag';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { ProColumns } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import DistributionActionButton from '../button/distribution-action';

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
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
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
            dataIndex: 'dsp',
            key: 'dsp',
            width: 250,

            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <Image
                                src={record?.dsp?.picture ?? FALLBACK_IMAGE}
                                alt="thumbnail"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold">{record?.dsp?.name}</span>
                    </div>
                );
            },
        },
        {
            title: messages('distribution.lastEnqueue'),
            key: 'lastEnqueuedAt',
            dataIndex: 'lastEnqueuedAt',
            align: 'left',
            width: 250,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'lastEnqueuedAt'
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
            key: 'lastDeliveredAt',
            dataIndex: 'lastDeliveredAt',
            align: 'left',
            width: 250,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'lastDeliveredAt'
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
            render: (value, record) => (
                <ReleaseStatusTag status={record?.status} />
            ),
        },

        {
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (value, record) => (
                <DistributionActionButton
                    showDistribute
                    showDelete
                    onShowDistribute={() => {
                        openModal(
                            TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION,
                            record
                        );
                    }}
                    onShowDelete={() => {}}
                />
            ),
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
