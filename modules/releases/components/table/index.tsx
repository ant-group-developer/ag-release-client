import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import {
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_STATUS,
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
} from '../../enums';
import { useTestUploadCi } from '../../hooks/use-test-upload-ci';
import { useTestUploadSpotify } from '../../hooks/use-test-upload-spotify';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleaseStatusTag from '../tag/release-status-tag';
import ReleaseTitleColumn from './title-column';

type Props = Omit<AppProTableProps<ReleasesData>, 'columns'> & {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleasesTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const { isSystemTenant } = useAuth();
    const { hasPermission } = usePermission();
    const { testUploadSpotify } = useTestUploadSpotify();
    const { testUploadCi } = useTestUploadCi();

    const column: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => {
                return (
                    <div data-stop-row-click="true">
                        {getIndex(
                            props?.pagination?.pageSize,
                            props?.pagination?.current,
                            index
                        )}
                    </div>
                );
            },
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
                return (
                    <ReleaseTitleColumn
                        record={record}
                        onChangeFilter={onChangeFilter}
                    />
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
                <CustomTooltip
                    title={messages('filter.filterByValue', {
                        value: record?.label?.name,
                    })}
                >
                    <span
                        data-stop-row-click="true"
                        onClick={() =>
                            onChangeFilter({
                                labelId: record?.labelId,
                            })
                        }
                        className="cursor-pointer truncate hover:underline"
                    >
                        {record?.label?.name}
                    </span>
                </CustomTooltip>
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
                    <Tag className="cursor-pointer truncate">
                        {record?.albumFormat?.name}
                    </Tag>
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
                <Paragraph
                    data-stop-row-click="true"
                    className="!mb-0"
                    copyable={!!record?.upc}
                >
                    {record?.upc}
                </Paragraph>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
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
                        DATE_FORMAT.DATE_MINUTE
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
            defaultSortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASES_COLUMNS_DISPLAY.CREATED_AT
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.createdAt,
                        DATE_FORMAT.DATE_MINUTE
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
                        DATE_FORMAT.DATE_MINUTE
                    )}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (_, record) => {
                const status = record?.status;
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <ActionButton
                            showUpdate={hasPermission(
                                PERMISSION.RELEASE.UPDATE
                            )}
                            showDetail
                            showDelete={status === RELEASES_STATUS.DRAFT}
                            onShowDelete={() =>
                                openModal(TYPE_MODAL_RELEASE.DELETE, record)
                            }
                            onShowDetail={() => {
                                nProgress.start();
                                router.push(
                                    getReleaseDetailTabRoute(
                                        record?.id,
                                        RELEASES_TABS.CORE_DETAIL,
                                        RELEASE_DETAIL_ACTION.READ
                                    )
                                );
                            }}
                            onShowUpdate={() => {
                                nProgress.start();
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
                );
            },
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
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
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
            onRow={(record) => ({
                onClick: (e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-stop-row-click="true"]')) return;

                    nProgress.start();
                    router.push(
                        getReleaseDetailTabRoute(
                            record?.id,
                            RELEASES_TABS.CORE_DETAIL,
                            RELEASE_DETAIL_ACTION.READ
                        )
                    );
                },
            })}
        />
        // </div>
    );
}
