import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import ReleaseTitleColumn from '@/modules/releases/components/table/title-column';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import { DISTRIBUTION_SORT_FIELD } from '../../constants/table';
import { getDistributionDetailRoute } from '../../helpers/link';
import { DistributionListFilter, DistributionListItem } from '../../types';
import DistributionStateTag from '../distribution-state-tag';

type Props = Omit<AppProTableProps<DistributionListItem>, 'columns'> & {
    dataFilter: DistributionListFilter;
    onChangeFilter: OnChangeFilter<DistributionListFilter>;
    pagination: { pageSize: number; current: number };
};

/** Đếm DSP live: ưu tiên server count, fallback đếm releaseDspDeliveries. */
const resolveDspLive = (record: DistributionListItem) => {
    if (typeof record.dspsLiveCount === 'number') {
        return `${record.dspsLiveCount}/${record.dspsTotalCount ?? 0}`;
    }
    const deliveries = record.releaseDspDeliveries ?? [];
    const live = deliveries.filter(
        (d) => d.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
    ).length;
    return `${live}/${deliveries.length}`;
};

export default function DistributionTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const { token } = theme.useToken();
    const { isSystemTenant } = useAuth();

    const goDetail = (releaseId: string) => {
        nProgress.start();
        router.push(getDistributionDetailRoute(releaseId));
    };

    const columns: ProColumns<DistributionListItem>[] = [
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
            ellipsis: true,
            width: 320,
            fixed: 'left',
            render: (_, record) => (
                <ReleaseTitleColumn
                    record={record}
                    onChangeFilter={onChangeFilter as never}
                />
            ),
        },
        {
            title: 'Label',
            key: 'label',
            width: 180,
            ellipsis: true,
            render: (_, record) => record?.label?.name,
        },
        {
            title: messages('release.type'),
            key: 'type',
            width: 130,
            render: (_, record) => (
                <Tag className="truncate">{record?.albumFormat?.name}</Tag>
            ),
        },
        {
            title: 'UPC',
            key: 'upc',
            width: 180,
            render: (_, record) => (
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
            width: 170,
            render: (_, record) => (
                <DistributionStateTag state={record?.distributionState} />
            ),
        },
        {
            title: messages('release.dspLive'),
            key: DISTRIBUTION_SORT_FIELD.DSPS_LIVE,
            dataIndex: DISTRIBUTION_SORT_FIELD.DSPS_LIVE,
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                DISTRIBUTION_SORT_FIELD.DSPS_LIVE
            ),
            render: (_, record) => (
                <span className="truncate">{resolveDspLive(record)}</span>
            ),
        },
        {
            title: messages('release.trackCount'),
            key: DISTRIBUTION_SORT_FIELD.TRACKS_COUNT,
            dataIndex: DISTRIBUTION_SORT_FIELD.TRACKS_COUNT,
            width: 110,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                DISTRIBUTION_SORT_FIELD.TRACKS_COUNT
            ),
            render: (_, record) => (
                <span className="truncate">{record?.tracksCount}</span>
            ),
        },
        {
            title: messages('release.duration'),
            key: DISTRIBUTION_SORT_FIELD.TOTAL_DURATION,
            dataIndex: DISTRIBUTION_SORT_FIELD.TOTAL_DURATION,
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                DISTRIBUTION_SORT_FIELD.TOTAL_DURATION
            ),
            render: (_, record) => (
                <span className="truncate">
                    {convertSecondsToHoursMinutes(Number(record?.totalDuration))}
                </span>
            ),
        },
        {
            title: messages('release.releaseDate'),
            key: DISTRIBUTION_SORT_FIELD.RELEASE_DATE,
            dataIndex: DISTRIBUTION_SORT_FIELD.RELEASE_DATE,
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                DISTRIBUTION_SORT_FIELD.RELEASE_DATE
            ),
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.releaseDate, DATE_FORMAT.DATE_MINUTE)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: DISTRIBUTION_SORT_FIELD.UPDATED_AT,
            dataIndex: DISTRIBUTION_SORT_FIELD.UPDATED_AT,
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                DISTRIBUTION_SORT_FIELD.UPDATED_AT
            ),
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.updatedAt, DATE_FORMAT.DATE_MINUTE)}
                </span>
            ),
        },
    ];

    if (isSystemTenant) {
        columns.splice(4, 0, {
            title: messages('tenant.label'),
            key: 'tenant',
            width: 160,
            render: (_, record) => (
                <CustomTooltip title={record?.tenant?.name}>
                    <span className="truncate">{record?.tenant?.name}</span>
                </CustomTooltip>
            ),
        });
    }

    return (
        <AppProTable
            headerTitle={messages('distributionOrchestration.label')}
            {...props}
            pagination={false}
            columns={columns}
            rowClassName="group cursor-pointer"
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            onRow={(record) => ({
                onClick: (e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-stop-row-click="true"]')) return;
                    goDetail(record.id);
                },
            })}
        />
    );
}
