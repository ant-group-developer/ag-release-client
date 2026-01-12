import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { TYPE_MODAL_TRACK_TYPE } from '../../enums';
import { useUpdateTrackType } from '../../hooks/use-update-track-type';
import { TrackTypeData, TrackTypeDataFilter } from '../../types';

type Props = Omit<AppTableProps<TrackTypeData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: TrackTypeDataFilter;
};

export const TrackTypeTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateTrackType } = useUpdateTrackType();
    const column: ColumnType<TrackTypeData>[] = [
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
            title: messages('trackType.label'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 400,
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
                    label={messages('trackType.label')}
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
            width: 300,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'code'
            ),
            render: (value) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={value}
                    label={messages('common.code')}
                >
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        {
            title: messages('common.setIsDefault'),
            key: 'isDefault',
            dataIndex: 'isDefault',
            align: 'center',
            width: 150,
            render: (value, record) => (
                <Switch
                    checked={record?.isDefault}
                    onChange={(e) => {
                        const id = toast.loading('Please wait...');
                        updateTrackType({
                            id: record?.id,
                            payload: { isDefault: e },
                            onSuccess(e) {
                                toast.update(id, {
                                    render: 'All is good',
                                    type: 'success',
                                    isLoading: false,
                                    autoClose: 2000,
                                });
                            },
                        });
                    }}
                />
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 200,
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
            width: 200,
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
                        openModal(TYPE_MODAL_TRACK_TYPE.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_TRACK_TYPE.UPDATE, record)
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
