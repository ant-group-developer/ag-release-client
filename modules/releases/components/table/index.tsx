import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import {
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
} from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleaseCoverImage from '../image/release-cover-image';

type Props = Omit<AppTableProps<ReleasesData>, 'columns'> & {
    dataFilter: ReleasesDataFilter;
    visibleColumns: RELEASES_COLUMNS_DISPLAY[];
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleasesTable({
    onChangeFilter,
    visibleColumns,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);

    const { isSystemTenant } = useAuth();

    const column: ColumnType<ReleasesData>[] = [
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
            title: messages('releases.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 220,
            fixed: 'left',
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div>
                        <ReleaseCoverImage data={record} />
                    </div>
                    <CustomTooltip
                        title={messages('common.viewDetail')}
                        placement="right"
                    >
                        <Link
                            href={getReleaseDetailTabRoute(
                                record?.id,
                                RELEASES_TABS.CORE_DETAIL,
                                RELEASE_DETAIL_ACTION.READ
                            )}
                        >
                            <span className="cursor-pointer truncate hover:text-blue-500 hover:underline">
                                {value}
                            </span>
                        </Link>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
            width: 180,
            render: (value, record) => {
                const releaseArtists = record?.releaseArtists || [];
                const isVariousArtist = record?.isVariousArtist;

                const mainArtist = !isVariousArtist
                    ? releaseArtists.find(
                          (item: ReleaseArtist) =>
                              item?.artistRole?.code?.toLowerCase() ===
                              MAIN_ARTIST_ROLE
                      )
                    : null;

                const displayName = isVariousArtist
                    ? messages('common.variousArtists')
                    : mainArtist?.artist?.name || '';
                return (
                    <CustomTooltip
                        size="small"
                        title={messages('filter.filterByValue', {
                            value: displayName,
                        })}
                    >
                        {isVariousArtist ? (
                            <span
                                className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"
                                onClick={() =>
                                    onChangeFilter({
                                        isVariousArtist: 'true',
                                    })
                                }
                            >
                                {messages('common.variousArtists')}
                            </span>
                        ) : (
                            <span
                                onClick={() =>
                                    onChangeFilter({
                                        artistId: mainArtist?.artist?.id,
                                    })
                                }
                                className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"
                            >
                                {mainArtist?.artist?.name || ''}
                            </span>
                        )}
                    </CustomTooltip>
                );
            },
        },
        {
            title: 'Label',
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value, record) => (
                // <CustomTooltip size="small" title={record?.label?.name}>
                //     <span className="cursor-pointer truncate ">
                //         {record?.label?.name}
                //     </span>
                // </CustomTooltip>
                <CopyText text={record?.label?.name}>
                    {record?.label?.name}
                </CopyText>
            ),
        },
        {
            title: messages('releases.type'),
            key: 'type',
            dataIndex: 'type',
            // align: 'center',
            width: 120,
            render: (_, record) => {
                return (
                    <span className="cursor-pointer truncate">
                        {' '}
                        {record?.albumFormat?.name}{' '}
                    </span>
                );
            },
        },
        {
            title: 'UPC',
            key: 'upc',
            dataIndex: 'UPC',
            align: 'center',
            width: 120,
            render: (value, record) => (
                <CustomTooltip size="small" title={record?.upc}>
                    <span className="truncate"> {record?.upc} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render: (value) => (
                <span className="cursor-pointer truncate">
                    {messages(getIntlCodeByReleaseStatus(value))}
                </span>
            ),
        },
        {
            title: messages('tracks.label'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'tracks_count'
            ),
            render: (value, record) => (
                <span className="truncate"> {record?.tracksCount} </span>
            ),
        },
        {
            title: messages('releases.duration'),
            key: RELEASES_COLUMNS_DISPLAY.DURATION,
            dataIndex: RELEASES_COLUMNS_DISPLAY.DURATION,
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASES_COLUMNS_DISPLAY.DURATION
            ),
            render: (value, record) => {
                const duration = convertSecondsToHoursMinutes(
                    Number(record?.totalDuration)
                );

                return <span className="truncate">{duration}</span>;
            },
        },
        {
            title: messages('releases.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            width: 130,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'releaseDate'
            // ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value, DATE_FORMAT.DATE_ONLY)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 130,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.createdAt,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (_, record) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionButton
                        showUpdate
                        showDetail
                        showDelete
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_RELEASE.DELETE, record)
                        }
                        onShowDetail={() => {
                            router.push(
                                getReleaseDetailTabRoute(
                                    record?.id,
                                    RELEASES_TABS.CORE_DETAIL
                                )
                            );
                        }}
                        onShowUpdate={() => {
                            router.push(
                                getReleaseDetailTabRoute(
                                    record?.id,
                                    RELEASES_TABS.CORE_DETAIL,
                                    RELEASE_DETAIL_ACTION.EDIT
                                )
                            );
                        }}
                    />
                </div>
            ),
        },
    ];

    if (isSystemTenant) {
        column.splice(4, 0, {
            title: messages('tenant.label'),
            key: 'tenant',
            dataIndex: 'tenant',
            width: 180,
            render: (_, record) => {
                return record.tenant?.name;
            },
        });
    }

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
