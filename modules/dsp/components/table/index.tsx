import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { DSP_DEAL, DSP_TABLE_KEY, TYPE_MODAL_DSP } from '../../enums';
import { useUpdateDsp } from '../../hooks/use-update-dsp';
import { DspData } from '../../types';

type Props = Omit<AppProTableProps<DspData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const DspTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateDsp } = useUpdateDsp();
    const { token } = theme.useToken();
    const { hasPermission } = usePermission();
    const canUpdate = hasPermission(PERMISSION.DSP.UPDATE);

    const column: ProColumns<DspData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
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
            title: messages('dsp.name'),
            key: 'name',
            dataIndex: DSP_TABLE_KEY.NAME,
            ellipsis: true,
            align: 'left',
            width: 250,
            fixed: 'left',
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? FALLBACK_IMAGE}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <span title={record?.name} className="truncate">
                        {record?.name}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: DSP_TABLE_KEY.CODE,
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
            title: messages('dsp.codeCi'),
            key: 'codeCi',
            dataIndex: DSP_TABLE_KEY.CODE_CI,
            align: 'left',
            width: 120,
            render: (value, record) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={record?.codeCi}
                >
                    <p className="truncate text-nowrap">{record?.codeCi}</p>
                </CopyText>
            ),
        },
        {
            title: messages('dsp.ddexPartyId'),
            key: 'ddexId',
            dataIndex: DSP_TABLE_KEY.DDEX_ID,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={record?.ddexId}
                >
                    <p className="truncate">{record?.ddexId}</p>
                </CopyText>
            ),
        },
        {
            title: messages('dsp.fullNameOfDDexParty'),
            key: 'ddexName',
            dataIndex: DSP_TABLE_KEY.DDEX_NAME,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={record?.ddexName}
                >
                    <p className="truncate">{record?.ddexName}</p>
                </CopyText>
            ),
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: DSP_TABLE_KEY.IS_ACTIVE,
            align: 'center',
            width: 80,
            render: (value, record) => (
                <Switch
                    value={record?.isActive}
                    onChange={(e) =>
                        updateDsp({ id: record?.id, payload: { isActive: e } })
                    }
                    disabled={!canUpdate}
                />
            ),
        },
        {
            title: `${messages('status.active')} ${messages('common.policies').toLowerCase()}`,
            key: 'enablePolicy',
            dataIndex: DSP_TABLE_KEY.ENABLE_POLICY,
            align: 'center',
            width: 130,
            render: (value, record) => (
                <Switch
                    value={record?.enablePolicy}
                    onChange={(e) =>
                        updateDsp({
                            id: record?.id,
                            payload: { enablePolicy: e },
                        })
                    }
                    disabled={!canUpdate}
                />
            ),
        },
        {
            title: messages('roles.isDefault'),
            key: 'isDefault',
            dataIndex: DSP_TABLE_KEY.IS_DEFAULT,
            align: 'center',
            width: 100,
            render: (value, record) => (
                <Switch
                    value={record?.isDefault}
                    onChange={(e) =>
                        updateDsp({
                            id: record?.id,
                            payload: { isDefault: e },
                        })
                    }
                    disabled={!canUpdate}
                />
            ),
        },
        {
            title: messages('dsp.dealMerlin'),
            key: 'hasDeal',
            dataIndex: DSP_TABLE_KEY.HAS_DEAL,
            align: 'center',
            width: 120,
            render: (value, record) => (
                <Switch
                    value={record?.hasDeal}
                    onChange={(e) =>
                        updateDsp({
                            id: record?.id,
                            payload: { hasDeal: e },
                        })
                    }
                    disabled={!canUpdate}
                />
            ),
        },
        {
            title: messages('dsp.dealType'),
            key: 'dspRoutingConfig',
            dataIndex: DSP_TABLE_KEY.DSP_ROUTING_CONFIG,
            align: 'center',
            width: 100,
            ellipsis: true,
            render: (value, record) => {
                const isDirect =
                    record?.dspRoutingConfig?.mode === DSP_DEAL.DIRECT;
                const isSystem =
                    record?.dspRoutingConfig?.mode === DSP_DEAL.SYSTEM_DEFAULT;
                const aggregatorName =
                    record?.dspRoutingConfig?.aggregator?.name;
                const display = isDirect
                    ? messages('common.direct')
                    : isSystem
                      ? messages('common.system')
                      : aggregatorName;
                return <span>{display}</span>;
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: DSP_TABLE_KEY.CREATED_AT,
            align: 'center',
            width: 150,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record.createdAt)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: DSP_TABLE_KEY.UPDATED_AT,
            align: 'center',
            width: 150,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record.updatedAt)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: DSP_TABLE_KEY.ACTION,
            width: 50,
            fixed: canUpdate ? 'right' : undefined,
            render: (_, record) => (
                <PermissionGate permission={PERMISSION.DSP.UPDATE}>
                    <ActionButton
                        showDelete={canUpdate}
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_DSP.DELETE, record)
                        }
                        showUpdate={canUpdate}
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_DSP.UPDATE, record)
                        }
                    />
                </PermissionGate>
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
        />
    );
};
