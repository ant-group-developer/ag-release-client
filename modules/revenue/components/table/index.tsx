import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import {
    formatCurrency,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { RevenueData, RevenueDataFilter } from '../../types';

type Props = Omit<AppTableProps<RevenueData>, 'columns'> & {
    dataFilter: RevenueDataFilter;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function RevenueTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();
    const params = useParams();
    const column: ColumnType<RevenueData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('common.date'),
            key: 'reportDate',
            dataIndex: 'trackRevenue.reportDate',
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'trackRevenue.reportDate'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.reportDate, DATE_FORMAT.DATE_ONLY)}
                </span>
            ),
        },
        {
            title: messages('release.label'),
            key: 'release',
            dataIndex: 'release.title',
            ellipsis: true,
            align: 'left',
            width: 200,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'release.title'
            ),
            render: (_, record) => {
                const name = record?.track?.release?.title;
                return (
                    <div className="truncate">
                        <CustomTooltip title={name}>
                            <p className="truncate">{name}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('track.label'),
            key: 'track',
            dataIndex: 'track.title',
            ellipsis: true,
            align: 'left',
            width: 200,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'track.title'
            ),
            render: (_, record) => {
                const name = record?.track?.title;
                return (
                    <div className="truncate">
                        <CustomTooltip title={name}>
                            <p className="truncate">{name}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('label.label'),
            key: 'label',
            dataIndex: 'label.name',
            ellipsis: true,
            align: 'left',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'label.name'
            ),
            render: (_, record) => {
                const name = record?.track?.release?.label?.name;
                return (
                    <div className="truncate">
                        <CustomTooltip title={name}>
                            <p className="truncate">{name}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('artist.label'),
            key: 'artist',
            dataIndex: 'artist.name',
            ellipsis: true,
            align: 'left',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'artist.name'
            ),
            render: (_, record) => {
                const trackArtists = record?.track?.trackArtists?.find(
                    (item) => item?.artistRole?.code === MAIN_ARTIST_ROLE
                );
                return (
                    <div className="truncate">
                        <CustomTooltip title={trackArtists?.artist?.name}>
                            <p className="truncate">
                                {trackArtists?.artist?.name}
                            </p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        // {
        //     title: messages('genre.label'),
        //     key: 'genre',
        //     dataIndex: 'genre',
        //     ellipsis: true,
        //     align: 'left',
        //     width: 150,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'genre.name'
        //     ),
        //     render: (_, record) => {
        //         const name = record?.track?.primaryGenre?.name;
        //         return (
        //             <div className="truncate">
        //                 <CustomTooltip title={name}>
        //                     <p className="truncate">{name}</p>
        //                 </CustomTooltip>
        //             </div>
        //         );
        //     },
        // },
        {
            title: messages('country.label'),
            key: 'countryCode',
            dataIndex: 'trackRevenue.countryCode',
            ellipsis: true,
            align: 'left',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'trackRevenue.countryCode'
            ),
            render: (value, record) => (
                <div className="truncate">
                    <CustomTooltip title={record?.countryCode}>
                        <p className="truncate">{record?.countryCode}</p>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: 'Configuration',
            key: 'configuration',
            dataIndex: 'trackRevenue.configuration',
            ellipsis: true,
            align: 'left',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'trackRevenue.configuration'
            ),
            render: (value, record) => (
                <div className="truncate">
                    <CustomTooltip title={record?.configuration}>
                        <p className="truncate">{record?.configuration}</p>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('dsp.label'),
            key: 'dsp',
            dataIndex: 'dsp.name',
            ellipsis: true,
            align: 'left',
            width: 134,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'dsp.name'
            ),
            render: (_, record) => {
                const name = record?.dsp?.name;
                return (
                    <div className="truncate">
                        <CustomTooltip title={name}>
                            <p className="truncate">{name}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.revenue'),
            key: 'revenue',
            dataIndex: 'revenue',
            ellipsis: true,
            align: 'left',
            width: 100,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'dsp.name'
            // ),
            render: (_, record) => {
                return (
                    <div className="truncate">
                        {formatCurrency(
                            Number(record?.amount),
                            record?.currencyCode
                        )}{' '}
                        {record?.currencyCode}
                    </div>
                );
            },
        },
        {
            title: messages('tenant.label'),
            key: 'tenant',
            dataIndex: 'tenant.name',
            ellipsis: true,
            align: 'left',
            width: 135,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'tenant.name'
            ),
            render: (_, record) => {
                const name = record?.track?.release?.tenant?.name;
                return (
                    <div className="truncate">
                        <CustomTooltip title={name}>
                            <p className="truncate">{name}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
}
