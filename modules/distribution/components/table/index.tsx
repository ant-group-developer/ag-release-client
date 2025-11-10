import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { convertSecondsToHoursMinutes, formattedDate } from '@/helpers/common';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { ReleasesData } from '@/modules/releases/types';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DISTRIBUTION } from '../../enum';
import { DistributionDataFilter } from '../../types';

type Props = Omit<AppProTableProps<ReleasesData>, 'columns'> & {
    dataFilter: DistributionDataFilter;
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
};

export default function DistributionTable({
    dataFilter,
    onChangeFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const { token } = theme.useToken();
    const column: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('release.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 300,
            fixed: 'left',
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 cursor-pointer">
                            <ReleaseCoverImage data={record} />
                        </div>

                        <p className="truncate">{value}</p>
                    </div>
                );
            },
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
                    <CustomTooltip size="small" title={displayName}>
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
                <CustomTooltip size="small" title={record?.label?.name}>
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {record?.label?.name}
                    </span>
                </CustomTooltip>
            ),
        },

        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value, record) => (
                <Tag className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                    {messages(getIntlCodeByReleaseStatus(record?.status))}
                </Tag>
            ),
        },
        {
            title: messages('release.trackCount'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'left',
            width: 100,
            render: (value, record) => (
                <span className="truncate"> {record?.tracksCount} </span>
            ),
        },
        {
            title: messages('release.duration'),
            key: 'duration',
            dataIndex: 'duration',
            align: 'left',
            width: 100,
            render: (value, record) => {
                const duration = convertSecondsToHoursMinutes(
                    Number(record?.totalDuration)
                );

                return <span className="truncate">{duration}</span>;
            },
        },
        {
            title: messages('release.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'left',
            width: 120,
            render: (value, record) => {
                return (
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {' '}
                        {record?.albumFormat?.name}{' '}
                    </span>
                );
            },
        },
        {
            title: messages('release.id'),
            key: 'releaseId',
            dataIndex: 'releaseId',
            align: 'left',
            width: 320,
            render: (value, record) => (
                <CustomTooltip size="small" title={record?.id}>
                    <span className="truncate"> {record?.id} </span>
                </CustomTooltip>
            ),
        },

        {
            title: 'UPC',
            key: 'upc',
            dataIndex: 'UPC',
            align: 'left',
            width: 120,
            render: (value, record) => (
                <CustomTooltip size="small" title={record?.upc}>
                    <span className="truncate"> {record?.upc} </span>
                </CustomTooltip>
            ),
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
        {
            title: messages('release.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'left',
            width: 180,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.releaseDate)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'left',
            width: 180,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.createdAt)}{' '}
                </span>
            ),
        },
    ];

    return (
        <AppProTable
            headerTitle={messages('release.list')}
            {...props}
            className={`rounded-t-lg px-4 ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
            onRow={(record) => ({
                onClick: () =>
                    openModal(TYPE_MODAL_DISTRIBUTION.DETAIL, record),
            })}
            columnsState={{
                persistenceKey: 'distribute-table-columns',
                persistenceType: 'sessionStorage',
                defaultValue: {
                    releaseDate: { show: false },
                    createdAt: { show: false },
                    releaseId: { show: false },
                },
            }}
            tableAlertRender={({
                selectedRowKeys,
                selectedRows,
                onCleanSelected,
            }) => (
                <div className="flex items-center gap-1 font-semibold">
                    <span>{selectedRowKeys.length}</span>
                    <span>{messages('common.selected')}</span>
                    <Button className="" type="primary">
                        <span>
                            {messages('distribution.batchDistribution')}
                        </span>
                    </Button>
                    <Button danger>
                        <span>{messages('distribution.batchTakeDown')}</span>
                    </Button>
                </div>
            )}
        />
    );
}
