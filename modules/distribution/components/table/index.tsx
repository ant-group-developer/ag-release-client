import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { convertSecondsToHoursMinutes, formattedDate } from '@/helpers/common';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    TYPE_MODAL_DISTRIBUTION,
} from '../../enum';
import { DistributionDataFilter } from '../../types';

type Props = Omit<AppTableProps<ReleasesData>, 'columns'> & {
    dataFilter: DistributionDataFilter;
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    visibleColumns: DISTRIBUTION_COLUMNS_DISPLAY[];
};

export default function DistributionTable({
    dataFilter,
    onChangeFilter,
    visibleColumns,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const column: ColumnType<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        // {
        //     // title: messages('common.thumbnail'),
        //     key: 'thumbnail',
        //     dataIndex: 'thumbnail',
        //     align: 'center',
        //     width: 100,
        //     fixed: 'left',
        //     render: (value, record) => (
        //         <div
        //             className="flex items-center justify-center"
        //             // onClick={() =>
        //             //     router.push(
        //             //         `${APP_ROUTES.RELEASES}/detail/${record.releaseId}/core-detail`
        //             //     )
        //             // }
        //         >
        //             <Image
        //                 src={value}
        //                 alt="thumbnail"
        //                 width={200}
        //                 height={200}
        //                 className="h-12 w-12 cursor-pointer rounded-lg object-cover"
        //             />
        //         </div>
        //     ),
        // },
        {
            title: messages('release.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 200,
            fixed: 'left',
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => {
                            router.push(
                                getReleaseTabRoute(
                                    record?.id,
                                    RELEASES_TABS.CORE_DETAIL
                                )
                            );
                        }}
                    >
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.coverArtThumbnails?.['75x75'] ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>

                    <p className="truncate">{value}</p>
                </div>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
            width: 300,
            render: (value, record) => {
                const releaseArtists = record?.releaseArtists || [];
                const isVariousArtist = record?.isVariousArtist;

                const mainArtist = !isVariousArtist
                    ? releaseArtists.find(
                          (item: ReleaseArtist) =>
                              item?.artistRole?.code === MAIN_ARTIST_ROLE
                      )
                    : null;

                const displayName = isVariousArtist
                    ? messages('common.variousArtists')
                    : mainArtist?.artist?.name || '';
                return (
                    <CustomTooltip size="small" title={value}>
                        <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                            {displayName}
                        </span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: 'Label',
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (value, record) => (
                <CustomTooltip size="small" title={value}>
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {record?.label?.name}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('release.releaseDate'),
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
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
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
            title: messages('release.trackCount'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
            render: (value) => <span className="truncate"> {value} </span>,
        },
        {
            title: messages('release.type'),
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
            title: messages('release.id'),
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
            title: messages('release.duration'),
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
            render: () => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionButton showUpdate showDetail showDelete />
                </div>
            ),
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
