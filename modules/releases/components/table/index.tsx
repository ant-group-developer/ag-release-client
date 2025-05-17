import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIntlCodeByReleaseStatus,
} from '@/helpers/common';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { RELEASES_COLUMNS_DISPLAY } from '../../enums';
import { ReleasesData } from '../../types';

type Props = Omit<AppTableProps<ReleasesData>, 'columns'> & {
    visibleColumns: RELEASES_COLUMNS_DISPLAY[];
};

export default function ReleasesTable({ visibleColumns, ...props }: Props) {
    const messages = useTranslations();
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
            render: (value) => (
                <div className="flex items-center justify-center">
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
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('releases.id'),
            key: 'releaseId',
            dataIndex: 'releaseId',
            align: 'center',
            fixed: 'left',
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },

        {
            title: messages('releases.publisher'),
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 170,
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
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
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
            title: messages('releases.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'left',
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
            title: 'UPC',
            key: 'upc',
            dataIndex: 'UPC',
            align: 'center',
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
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
            title: messages('releases.trackCount'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
            render: (value) => <span className="truncate"> {value} </span>,
        },
        {
            title: messages('releases.duration'),
            key: 'duration',
            dataIndex: 'duration',
            align: 'center',
            render: (value) => {
                const duration = convertSecondsToHoursMinutes(Number(value));

                return <span className="truncate">{duration}</span>;
            },
        },
        {
            title: messages('releases.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            width: 130,
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
            width: 130,
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
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
            column.key as RELEASES_COLUMNS_DISPLAY
        ),
    }));

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={newColumns}
            rowClassName={'group'}
        />
    );
}
