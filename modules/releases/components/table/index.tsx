import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON_SMALL } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/modules/releases/helpers/link';
import { useTakedownRelease } from '@/modules/releases/hooks/use-takedown-release';
import { ProColumns } from '@ant-design/pro-components';
import { Modal, Tag, theme } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { CircleX, Filter, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import { useState } from 'react';
import {
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_STATUS,
    RELEASES_TABLE_KEY,
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
} from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleaseStatusTag from '../tag/release-status-tag';
import DspDeliveryFilterDropdown from './dsp-delivery-filter-dropdown';
import DspLiveColumn from './dsp-live-column';
import DspStatusModal from './dsp-status-modal';
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
    const [isDspModalOpen, setIsDspModalOpen] = useState(false);
    const [isDspFilterOpen, setIsDspFilterOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ReleasesData | null>(
        null
    );
    const { isSystemTenant, isAdmin } = useAuth();
    const { hasPermission } = usePermission();
    const canDelete = hasPermission(PERMISSION.RELEASE_AUDIO.DELETE);
    const canTakedown = hasPermission(PERMISSION.RELEASE_AUDIO.TAKE_DOWN);
    const setAction = useReleaseActionStore((state) => state.setAction);
    const { takedownRelease } = useTakedownRelease();

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
            dataIndex: RELEASES_TABLE_KEY.TITLE,
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
            dataIndex: RELEASES_TABLE_KEY.PUBLISHER,
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
            dataIndex: RELEASES_TABLE_KEY.TYPE,
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
            dataIndex: RELEASES_TABLE_KEY.UPC,
            align: 'left',
            width: 200,
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
            dataIndex: RELEASES_TABLE_KEY.STATUS,
            align: 'left',
            width: 150,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
            },
        },
        {
            title: messages('release.dspLive'),
            key: RELEASES_TABLE_KEY.DSP_LIVES,
            dataIndex: RELEASES_TABLE_KEY.DSP_LIVES,
            align: 'left',
            width: 200,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASES_TABLE_KEY.DSP_LIVES
            ),
            filterDropdownOpen: isDspFilterOpen,
            onFilterDropdownOpenChange: setIsDspFilterOpen,
            filterIcon: () => (
                <Filter
                    size={SIZE_ICON_SMALL}
                    style={{
                        color:
                            dataFilter.dspDelivery ||
                            dataFilter.hangingExecutionDays !== undefined
                                ? token.colorPrimary
                                : undefined,
                    }}
                />
            ),
            filterDropdown: () => (
                <DspDeliveryFilterDropdown
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    onClose={() => setIsDspFilterOpen(false)}
                />
            ),
            render: (_, record) => (
                <DspLiveColumn
                    releaseDspDeliveries={record?.releaseDspDeliveries}
                    onClick={() => {
                        setSelectedRecord(record);
                        setIsDspModalOpen(true);
                    }}
                />
            ),
        },
        {
            title: messages('release.trackCount'),
            key: 'tracks_count',
            dataIndex: RELEASES_TABLE_KEY.TRACK_COUNT,
            align: 'left',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASES_TABLE_KEY.TRACK_COUNT
            ),
            render: (value, record) => (
                <span className="truncate"> {record?.tracksCount} </span>
            ),
        },
        {
            title: messages('release.duration'),
            key: 'total_duration',
            dataIndex: RELEASES_TABLE_KEY.DURATION,
            align: 'left',
            width: 120,
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
            dataIndex: RELEASES_TABLE_KEY.RELEASE_DATE,
            align: 'left',
            width: 160,
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
            // key: 'createdAt',
            dataIndex: RELEASES_TABLE_KEY.CREATED_AT,
            align: 'left',
            width: 160,
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
            dataIndex: RELEASES_TABLE_KEY.UPDATED_AT,
            align: 'left',
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASES_TABLE_KEY.UPDATED_AT
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
                            showDetail
                            showUpdate
                            showDelete={
                                (status === RELEASES_STATUS.DRAFT &&
                                    canDelete) ||
                                isAdmin
                            }
                            onShowDelete={() =>
                                openModal(TYPE_MODAL_RELEASE.DELETE, record)
                            }
                            onShowDetail={() => {
                                nProgress.start();
                                setAction(RELEASE_DETAIL_ACTION.READ);
                                router.push(
                                    getReleaseDetailTabRoute(
                                        record?.id,
                                        RELEASES_TABS.CORE_DETAIL
                                    )
                                );
                            }}
                            onShowUpdate={() => {
                                nProgress.start();
                                setAction(RELEASE_DETAIL_ACTION.EDIT);
                                router.push(
                                    getReleaseDetailTabRoute(
                                        record?.id,
                                        RELEASES_TABS.CORE_DETAIL
                                    )
                                );
                            }}
                            extraItems={[
                                {
                                    key: 'take-down',
                                    label: (
                                        <div className="flex items-center gap-2">
                                            <CircleX size={SIZE_ICON_SMALL} />
                                            {messages('release.takeDown')}
                                        </div>
                                    ),
                                    show:
                                        status ===
                                            (RELEASES_STATUS.DISTRIBUTED ||
                                                RELEASES_STATUS.AWAITING_ACTION) &&
                                        canTakedown,
                                    danger: true,
                                    onClick: () => {
                                        Modal.confirm({
                                            title: messages(
                                                'release.takeDownConfirmTitle'
                                            ),
                                            content: messages.rich(
                                                'release.takeDownConfirmContent',
                                                {
                                                    title: record?.title,
                                                    b: (chuck) => (
                                                        <strong>{chuck}</strong>
                                                    ),
                                                }
                                            ),
                                            okText: messages('common.yes'),
                                            cancelText:
                                                messages('common.cancel'),
                                            onOk: () => {
                                                takedownRelease({
                                                    id: record?.id,
                                                });
                                            },
                                        });
                                    },
                                },
                                {
                                    key: 'distribution',
                                    label: (
                                        <div className="flex items-center gap-2">
                                            <Globe size={SIZE_ICON_SMALL} />
                                            {messages('common.distribute')}
                                        </div>
                                    ),
                                    show:
                                        record?.status !==
                                        RELEASES_STATUS.DRAFT,
                                    onClick: () => {
                                        nProgress.start();
                                        router.push(
                                            `${APP_ROUTES.RELEASES_DISTRIBUTION}/${record?.id}`
                                        );
                                    },
                                },
                            ]}
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
            dataIndex: RELEASES_TABLE_KEY.TENANT,
            width: 180,
            render: (_, record) => {
                return record.tenant?.name;
            },
        });
    }

    return (
        <>
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
                        tenant: { show: isSystemTenant },
                        updatedAt: { show: false },
                        dsp: { show: true },
                    },
                }}
                // onRow={(record) => ({
                //     onClick: (e) => {
                //         const target = e.target as HTMLElement;
                //         if (target.closest('[data-stop-row-click="true"]')) return;

                //         nProgress.start();
                //         router.push(
                //             getReleaseDetailTabRoute(
                //                 record?.id,
                //                 RELEASES_TABS.CORE_DETAIL
                //             )
                //         );
                //     },
                // })}
            />
            <DspStatusModal
                open={isDspModalOpen}
                onCancel={() => {
                    setIsDspModalOpen(false);
                    setSelectedRecord(null);
                }}
                record={selectedRecord}
            />
        </>
    );
}
