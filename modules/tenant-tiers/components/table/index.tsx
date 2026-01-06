import ActionButton from '@/components/ui/button/action-button';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_TENANT_TIERS } from '../../enums';
import { TenantTiersData, TenantTiersDataFilter } from '../../types';

type Props = Omit<AppProTableProps<TenantTiersData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: TenantTiersDataFilter;
};

export default function TenantTiersTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { token } = theme.useToken();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

    const column: ProColumns<TenantTiersData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 80,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: `${messages('common.name')}`,
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => {
                const name = getNameByLocale(
                    record?.nameEn,
                    record?.nameVi,
                    locale
                );
                return (
                    <div className="flex items-center gap-4">
                        <CustomTooltip title={name}>
                            <span className="truncate">{name}</span>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CustomTooltip title={record?.code}>
                    <span className="truncate">{record?.code}</span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.color'),
            key: 'color',
            dataIndex: 'color',
            align: 'left',
            width: 150,
            render: (value, record) => (
                <AppColorPicker disabled value={record?.color} />
            ),
        },
        {
            title: messages('common.minScore'),
            key: 'minScore',
            dataIndex: 'minScore',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <p className="truncate">{record?.minScore}</p>
            ),
        },
        {
            title: messages('common.maxScore'),
            key: 'maxScore',
            dataIndex: 'maxScore',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <p className="truncate">{record.maxScore}</p>
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
                <CustomTooltip title={record?.description}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.description}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.note}
                    </span>
                </CustomTooltip>
            ),
        },
        // {
        //     title: messages('common.createdAt'),
        //     key: 'createdAt',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 70,
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'createdAt'
        //     ),
        // },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     align: 'center',
        //     width: 70,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'updatedAt'
        //     ),
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        // },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_TENANT_TIERS.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_TENANT_TIERS.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
            className={`rounded-t-lg  ${props?.className}`}
            toolbar={{
                className: 'px-4',
            }}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
        />
    );
}
