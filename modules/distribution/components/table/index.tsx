import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIntlCodeByReleaseStatus,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { ReleasesData } from '@/modules/releases/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    TYPE_MODAL_DISTRIBUTION,
} from '../../enum';

type Props = Omit<AppTableProps<ReleasesData>, 'columns'> & {
    visibleColumns: DISTRIBUTION_COLUMNS_DISPLAY[];
};

export default function DistributionTable({ visibleColumns, ...props }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            // title: messages('common.thumbnail'),
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            align: 'center',
            width: 100,
            fixed: 'left',
            render: (value, record) => (
                <div
                    className="flex items-center justify-center"
                    // onClick={() =>
                    //     router.push(
                    //         `${APP_ROUTES.RELEASES}/detail/${record.releaseId}/core-detail`
                    //     )
                    // }
                >
                    <Image
                        src={value}
                        alt="thumbnail"
                        width={200}
                        height={200}
                        className="h-12 w-12 cursor-pointer rounded-lg object-cover"
                    />
                </div>
            ),
        },
        {
            title: messages('releases.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 300,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
            width: 300,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {' '}
                        {value}{' '}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: 'Label',
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {value}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('releases.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            width: 180,
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.dateCreated'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            width: 180,
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
            width: 120,
            render: (value) => (
                <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                    {messages(getIntlCodeByReleaseStatus(value))}
                </span>
            ),
        },
        {
            title: messages('releases.trackCount'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
            render: (value) => <span className="truncate"> {value} </span>,
        },
        {
            title: messages('releases.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'center',
            width: 120,
            render: (value) => {
                return (
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {' '}
                        {value}{' '}
                    </span>
                );
            },
        },
        {
            title: messages('releases.id'),
            key: 'releaseId',
            dataIndex: 'releaseId',
            align: 'center',
            fixed: 'left',
            width: 120,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },

        {
            title: 'UPC',
            key: 'upc',
            dataIndex: 'UPC',
            align: 'center',
            width: 120,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },

        {
            title: messages('releases.duration'),
            key: 'duration',
            dataIndex: 'duration',
            align: 'center',
            width: 100,
            render: (value) => {
                const duration = convertSecondsToHoursMinutes(Number(value));

                return <span className="truncate">{duration}</span>;
            },
        },

        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: () => <ActionButton showUpdate showDetail showDelete />,
        },
    ];

    const newColumns = column.map((column) => ({
        ...column,
        hidden: !visibleColumns?.includes(
            column.key as DISTRIBUTION_COLUMNS_DISPLAY
        ),
    }));

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={newColumns}
            rowClassName={'group cursor-pointer'}
            onRow={(record) => ({
                onClick: () =>
                    openModal(TYPE_MODAL_DISTRIBUTION.DETAIL, record),
            })}
        />
    );
}
