import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { getIndex, getSortOrder } from '@/helpers/common';
import { getLabelDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ProColumns } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import { LABEL_DETAIL_TABS, TYPE_MODAL_LABEL } from '../../enum';
import { LabelData, LabelDataFilter } from '../../types';

type Props = Omit<AppProTableProps<LabelData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: LabelDataFilter;
};

export const LabelsTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();

    const { isSystemTenant } = useAuth();
    const { hasPermission } = usePermission();

    const column: ProColumns<LabelData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 40,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('label.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CustomTooltip
                        placement="right"
                        title={messages('common.viewDetail')}
                    >
                        <Link
                            href={getLabelDetailRoute(
                                record?.id,
                                LABEL_DETAIL_TABS.OVERVIEW
                            )}
                        >
                            <p className="truncate hover:text-blue-500 hover:underline">
                                {record?.name}
                            </p>
                        </Link>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            render: (value, record) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={record?.code}
                >
                    <p className="truncate">{record?.code}</p>
                </CopyText>
            ),
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {record?.description}
                </span>
            ),
        },
        {
            title: messages('release.label'),
            key: 'releaseCount',
            dataIndex: 'release_count',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'release_count'
            ),
            render: (value, record) => (
                <p className="truncate">{record?.releaseCount}</p>
            ),
        },
        {
            title: messages('track.label'),
            key: 'trackCount',
            dataIndex: 'track_count',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'track_count'
            ),
            render: (value, record) => (
                <p className="truncate">{record?.trackCount}</p>
            ),
        },
        {
            title: messages('tenant.label'),
            key: 'tenant.name',
            dataIndex: 'tenant.name',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'tenant.name'
            ),
            render: (_, record) => {
                return record.tenant?.name;
            },
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate={hasPermission(PERMISSION.LABEL.UPDATE)}
                    showDetail
                    showDelete={isSystemTenant}
                    onShowDetail={() => {
                        nProgress.start();
                        router.push(
                            getLabelDetailRoute(
                                record?.id,
                                LABEL_DETAIL_TABS.OVERVIEW
                            )
                        );
                    }}
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_LABEL.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_LABEL.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
};
