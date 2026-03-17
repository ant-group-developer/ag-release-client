import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_RELEASE_TYPE } from '../../enums';
import { ReleaseTypesData, ReleaseTypesDataFilter } from '../../types';

type Props = Omit<AppTableProps<ReleaseTypesData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ReleaseTypesDataFilter;
};

export const ReleaseTypeTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<ReleaseTypesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 100,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('releaseType.label'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 350,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={value}
                    label={messages('releaseType.label')}
                >
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            ellipsis: true,
            align: 'left',
            width: 350,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'code'
            ),
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        // {
        //     title: messages('track.minTrack'),
        //     key: 'minTrackCount',
        //     dataIndex: 'minTrackCount',
        //     ellipsis: true,
        //     align: 'left',
        //     width: 150,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'minTrackCount'
        //     ),
        //     render: (value) => (
        //         // <CopyText tooltipProps={{ placement: 'right' }} text={value}>
        //         <p className="truncate">{value}</p>
        //         // </CopyText>
        //     ),
        // },
        // {
        //     title: messages('track.maxTrack'),
        //     key: 'maxTrackCount',
        //     dataIndex: 'maxTrackCount',
        //     ellipsis: true,
        //     align: 'left',
        //     width: 150,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'maxTrackCount'
        //     ),
        //     render: (value) => (
        //         // <CopyText tooltipProps={{ placement: 'right' }} text={value}>
        //         <p className="truncate">{value}</p>
        //         // </CopyText>
        //     ),
        // },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_RELEASE_TYPE.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_RELEASE_TYPE.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
};
