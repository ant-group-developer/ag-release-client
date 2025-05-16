import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate } from '@/helpers/common';
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
            title: messages('common.thumbnail'),
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            align: 'center',
            width: 150,
            fixed: 'left',
            render: (value) => (
                <div>
                    <Image
                        src={value}
                        alt="thumbnail"
                        width={200}
                        height={200}
                        className="aspect-video max-h-20 cursor-pointer rounded-lg object-cover"
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
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
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
            title: messages('releases.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'center',
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
            align: 'center',
            width: 130,
            ellipsis: true,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('releases.upc'),
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
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('releases.trackCount'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
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
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('releases.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            width: 130,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {formattedDate(value)} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.dateCreated'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {formattedDate(value)} </span>
                </CustomTooltip>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: () => <ActionButton showUpdate showDetail showDelete />,
        },
    ];

    const newColumns = column.map((column) => ({
        ...column,
        hidden: !visibleColumns?.includes(
            column.key as RELEASES_COLUMNS_DISPLAY
        ),
    }));

    return <AppTable {...props} pagination={false} columns={newColumns} />;
}
