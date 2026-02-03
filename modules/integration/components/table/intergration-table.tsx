import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_INTEGRATION } from '../../enums';
import { useUpdateIntegration } from '../../hooks/use-update';
import { IntegrationData, IntegrationDataFilter } from '../../types';

type Props = Omit<AppProTableProps<IntegrationData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: IntegrationDataFilter;
};

export default function IntegrationTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const { updateIntegration } = useUpdateIntegration();

    const column: ProColumns<IntegrationData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('dsp.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 300,
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.dsp?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={record?.dsp?.name}
                    >
                        <p className="truncate">{record?.dsp?.name}</p>
                    </CopyText>
                </div>
            ),
        },
        {
            title: messages('integration.deal.label'),
            key: 'deal',
            dataIndex: 'deal',
            width: 180,
            render: (value, record) => {
                return <span>{record?.agreementType}</span>;
            },
        },
        {
            title: messages('status.label'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 150,
            render: (value, record, index) => (
                <Switch
                    defaultChecked={record.isActive}
                    onChange={(e) => {
                        updateIntegration({
                            id: record?.id,
                            payload: {
                                isActive: e,
                            },
                        });
                    }}
                />
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 150,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.updatedAt)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 50,
            render: (_, record) => {
                return (
                    <ActionButton
                        showUpdate
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_INTEGRATION.UPDATE, record)
                        }
                    />
                );
            },
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
            search={false}
        />
    );
}
