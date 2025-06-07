import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIntlCodeByReleaseStatus } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import DistributionActionButton from '../button/distribution-action';

type Props = Omit<AppTableProps<any>, 'columns'> & {};

export default function DistributionTable({ ...props }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<any>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 80,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <Image
                                src={record?.thumbnail}
                                alt="thumbnail"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold">{value}</span>
                    </div>
                );
            },
        },
        {
            title: 'Last Enqueue',
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            title: 'Last Delivered',
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },

        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (value) => (
                <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                    {messages(getIntlCodeByReleaseStatus(value))}
                </span>
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
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
}
