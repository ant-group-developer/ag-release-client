import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { getIndex } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_AGGREGATOR } from '../../enums';
import { AggregatorData, AggregatorDataFilter } from '../../types';

type Props = Omit<AppProTableProps<AggregatorData>, 'columns'> & {
    dataFilter: AggregatorDataFilter;
    onChangeFilter: OnChangeFilter<AggregatorDataFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function AggregatorTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const columns: ProColumns<AggregatorData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 80,
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
            title: messages('common.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            render: (value, record) => value,
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            width: 250,
            ellipsis: true,
            align: 'left',
            render: (value, record) => value,
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (value, record) => {
                return <Switch checked={record?.isActive} />;
            },
        },
        {
            title: messages('aggregator.systemDefault'),
            key: 'isSystemDefault',
            dataIndex: 'isSystemDefault',
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (value, record) => {
                return <Switch checked={record?.isSystemDefault} />;
            },
        },
        {
            title: messages('common.email'),
            key: 'contactEmail',
            dataIndex: 'contactEmail',
            ellipsis: true,
            align: 'left',
            render: (value, record) => value,
        },
        {
            align: 'center',
            width: 100,
            render: (value, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_AGGREGATOR.DELETE, record)
                    }
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_AGGREGATOR.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            // headerTitle={messages('aggregator.list')}
            columns={columns}
            pagination={false}
        />
    );
}
