import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { getIndex } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_AGGREGATOR } from '../../enums';
import { useUpdateAggregator } from '../../hooks/use-update';
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
    const { updateAggregator } = useUpdateAggregator();

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
            width: 200,
            fixed: 'left',
            render: (value, record) => value,
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            width: 100,
            ellipsis: true,
            align: 'left',
            render: (value, record) => value,
        },
        {
            title: 'Host',
            key: 'host',
            dataIndex: 'host',
            width: 250,
            ellipsis: true,
            align: 'left',
            render: (value, record) => (
                <Typography>{record?.sftpConfig?.metadata?.host}</Typography>
            ),
        },
        {
            title: 'Port',
            key: 'port',
            dataIndex: 'port',
            width: 80,
            ellipsis: true,
            align: 'left',
            render: (value, record) => (
                <Typography.Text>
                    {record?.sftpConfig?.metadata?.port}
                </Typography.Text>
            ),
        },

        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (value, record) => {
                return (
                    <Switch
                        checked={record?.isActive}
                        onChange={(e) =>
                            updateAggregator({
                                id: record?.id,
                                payload: {
                                    isActive: e,
                                },
                            })
                        }
                    />
                );
            },
        },
        {
            title: messages('aggregator.systemDefault'),
            key: 'isDefault',
            dataIndex: 'isDefault',
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (value, record) => {
                const isDefault = record?.isDefault;
                return (
                    <Switch
                        disabled={isDefault}
                        checked={record?.isDefault}
                        onChange={(e) =>
                            updateAggregator({
                                id: record?.id,
                                payload: {
                                    isDefault: e,
                                },
                            })
                        }
                    />
                );
            },
        },
        {
            title: messages('aggregator.deliveryEmail'),
            key: 'deliveryEmail',
            dataIndex: 'deliveryEmail',
            width: 220,
            ellipsis: true,
            align: 'left',
            render: (value) => value,
        },
        {
            title: messages('aggregator.deliveryEmailSubject'),
            key: 'deliveryEmailSubject',
            dataIndex: 'deliveryEmailSubject',
            width: 240,
            ellipsis: true,
            align: 'left',
            render: (value) => value,
        },
        {
            title: messages('aggregator.manualUploadUrl'),
            key: 'manualUploadUrl',
            dataIndex: 'manualUploadUrl',
            width: 260,
            ellipsis: true,
            align: 'left',
            render: (value) => value,
        },
        {
            align: 'center',
            width: 100,
            fixed: 'right',
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
