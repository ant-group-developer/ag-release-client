import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
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
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import {
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
} from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleaseCoverImage from '../image/release-cover-image';

type Props = Omit<AppProTableProps<ReleasesData>, 'columns'> & {
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
    const { hasPermission } = usePermission();

    const column: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 320,
            fixed: 'left',
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
                    <div className="flex items-center gap-4">
                        <div className="h-10 min-w-10">
                            <ReleaseCoverImage data={record} />
                        </div>
                        <div>
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
                                    <div className="!max-w-80 cursor-pointer truncate hover:text-blue-500 hover:underline">
                                        {value}
                                    </div>
                                </Link>
                            </CustomTooltip>
                            <CustomTooltip
                                title={messages('filter.filterByValue', {
                                    value: displayName,
                                })}
                                placement="right"
                            >
                                {isVariousArtist ? (
                                    <span
                                        className="cursor-pointer truncate text-gray-500 hover:underline"
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
                                                artistId:
                                                    mainArtist?.artist?.id,
                                            })
                                        }
                                        className="cursor-pointer truncate text-gray-500 hover:underline"
                                    >
                                        {mainArtist?.artist?.name || ''}
                                    </span>
                                )}
                            </CustomTooltip>
                        </div>
                    </div>
                );
            },
        },
        // {
        //     title: messages('common.artist'),
        //     key: 'artist',
        //     dataIndex: 'artist',
        //     align: 'left',
        //     ellipsis: true,
        //     width: 250,
        //     render: (value, record) => {
        //         const releaseArtists = record?.releaseArtists || [];
        //         const isVariousArtist = record?.isVariousArtist;

        //         const mainArtist = !isVariousArtist
        //             ? releaseArtists.find(
        //                   (item: ReleaseArtist) =>
        //                       item?.artistRole?.code === MAIN_ARTIST_ROLE
        //               )
        //             : null;

        //         const displayName = isVariousArtist
        //             ? messages('common.variousArtists')
        //             : mainArtist?.artist?.name || '';
        //         return (
        //             <CustomTooltip
        //                 size="small"
        //                 title={messages('filter.filterByValue', {
        //                     value: displayName,
        //                 })}
        //             >
        //                 {isVariousArtist ? (
        //                     <span
        //                         className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"
        //                         onClick={() =>
        //                             onChangeFilter({
        //                                 isVariousArtist: 'true',
        //                             })
        //                         }
        //                     >
        //                         {messages('common.variousArtists')}
        //                     </span>
        //                 ) : (
        //                     <span
        //                         onClick={() =>
        //                             onChangeFilter({
        //                                 artistId: mainArtist?.artist?.id,
        //                             })
        //                         }
        //                         className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"
        //                     >
        //                         {mainArtist?.artist?.name || ''}
        //                     </span>
        //                 )}
        //             </CustomTooltip>
        //         );
        //     },
        // },
        {
            title: 'Label',
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 200,
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
            title: messages('release.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'left',
            width: 130,
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
            align: 'left',
            width: 150,
            render: (value, record) => (
                <CopyText text={record?.upc}>
                    <span className="truncate text-center">
                        {' '}
                        {record?.upc}{' '}
                    </span>
                </CopyText>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value, record) => {
                return (
                    <Tag className="cursor-pointer truncate">
                        {messages(getIntlCodeByReleaseStatus(record?.status))}
                    </Tag>
                );
            },
        },
        {
            title: messages('release.trackCount'),
            key: 'tracks_count',
            dataIndex: 'tracks_count',
            align: 'left',
            width: 120,
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
            title: messages('release.duration'),
            key: 'total_duration',
            dataIndex: 'total_duration',
            align: 'left',
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
            title: messages('release.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'left',
            width: 130,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'releaseDate'
            // ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.releaseDate,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                </span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'left',
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
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'left',
            width: 130,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.updatedAt,
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
                        showUpdate={hasPermission(PERMISSION.RELEASE.UPDATE)}
                        showDetail
                        showDelete={isSystemTenant}
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_RELEASE.DELETE, record)
                        }
                        onShowDetail={() => {
                            router.push(
                                getReleaseDetailTabRoute(
                                    record?.id,
                                    RELEASES_TABS.CORE_DETAIL,
                                    RELEASE_DETAIL_ACTION.READ
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

    return (
        // <div className="rounded-lg bg-white px-6 pt-2">
        <AppProTable
            headerTitle={messages('release.list')}
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
            columnsState={{
                persistenceKey: 'releases-table-columns',
                persistenceType: 'sessionStorage',
                defaultValue: {
                    tenant: { show: false },
                    tracks_count: { show: false },
                    total_duration: { show: false },
                    updatedAt: { show: false },
                },
            }}
        />
        // </div>
    );
}
