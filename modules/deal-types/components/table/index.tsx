import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DEAL_TYPE } from '../../enums';
import { useUpdateDealType } from '../../hooks/use-update';
import { DealTypeData, DealTypeDataFilter } from '../../types';

type Props = Omit<AppProTableProps<DealTypeData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: DealTypeDataFilter;
};

export default function DealTypeTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateDealType } = useUpdateDealType();
    const { token } = theme.useToken();

    const column: ProColumns<DealTypeData>[] = [
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
                const name = record?.name;
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
            width: 250,
            ellipsis: true,
            render: (value, record) => {
                const code = record?.code;
                return (
                    <CustomTooltip title={code}>
                        <span className="truncate">{code}</span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('dealType.requiredConnection'),
            key: 'requiredConnection',
            dataIndex: 'requiredConnection',
            align: 'left',
            width: 100,
            ellipsis: true,
            render: (value, record) => {
                return (
                    <Switch
                        onChange={(e) =>
                            updateDealType({
                                id: record?.id,
                                payload: {
                                    requiresConnection: e,
                                },
                            })
                        }
                        defaultValue={record?.requiresConnection}
                    />
                );
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.createdAt)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.updatedAt)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_DEAL_TYPE.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_DEAL_TYPE.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            key="issueTable"
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
}
