import ActionButton from '@/components/ui/button/action-button';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import CopyText from '@/components/ui/copy-text/copy-text';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ISSUE_LEVEL } from '../../enums';
import { useBulkUpdateIssueLevel } from '../../hooks/use-bulk-update';
import { IssueLevelData, IssueLevelDataFilter } from '../../types';

type Props = Omit<SortableTableProps<IssueLevelData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: IssueLevelDataFilter;
};

export default function IssueLevelTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { bulkUpdateIssueLevel } = useBulkUpdateIssueLevel();

    const { isSystemTenant } = useAuth();
    const { hasPermission } = usePermission();

    const handleDragEnd: OnDragEnd<IssueLevelData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            severityRank: index + 1,
        }));

        bulkUpdateIssueLevel({
            issueLevels: payload,
        });
    };

    const column: ColumnType<IssueLevelData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
        },
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
            title: `${messages('common.name')} VI`,
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={record?.nameVi}
                    >
                        <p className="truncate">{record?.nameVi}</p>
                    </CopyText>
                </div>
            ),
        },
        {
            title: `${messages('common.name')} EN`,
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={record?.nameEn}
                    >
                        <p className="truncate">{record?.nameEn}</p>
                    </CopyText>
                </div>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 200,
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        {
            title: messages('common.color'),
            key: 'color',
            dataIndex: 'color',
            align: 'left',
            width: 150,
            render: (value) => <AppColorPicker disabled value={value} />,
        },
        {
            title: messages('issueLevel.severityRank'),
            key: 'severityRank',
            dataIndex: 'severityRank',
            align: 'center',
            width: 150,
            render: (value) => <span className="truncate">{value}</span>,
        },
        {
            title: 'Weight',
            key: 'weight',
            dataIndex: 'weight',
            align: 'center',
            width: 80,
            render: (value) => <span className="truncate">{value}</span>,
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 200,
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {value}
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
                        openModal(TYPE_MODAL_ISSUE_LEVEL.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_ISSUE_LEVEL.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <div className="w-full">
            <SortableTable
                key="main"
                {...props}
                pagination={false}
                columns={column}
                rowClassName={'group'}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
}
