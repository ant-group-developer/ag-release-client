import IconButton from '@/components/ui/button/icon-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE, SIZE_ICON } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import { Edit, Settings, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DSP_DEAL_TENANT, TYPE_MODAL_DSP_TENANT } from '../../enums';
import { TenantDspData } from '../../types';

type Props = Omit<AppProTableProps<TenantDspData>, 'columns'>;

export const DspTenantTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const openModal = useModalStore((state) => state.openModal);

    const column: ProColumns<TenantDspData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('dsp.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 250,
            fixed: 'left',
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.dsp?.picture ?? FALLBACK_IMAGE}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <span title={record?.dsp?.name} className="truncate">
                        {record?.dsp?.name}
                    </span>
                </div>
            ),
        },
        // {
        //     title: messages('common.code'),
        //     key: 'code',
        //     dataIndex: 'code',
        //     align: 'left',
        //     width: 150,
        //     render: (value, record) => (
        //         <CopyText
        //             tooltipProps={{ placement: 'right' }}
        //             text={record?.dsp?.code}
        //         >
        //             <p className="truncate">{record?.dsp?.code}</p>
        //         </CopyText>
        //     ),
        // },
        // {
        //     title: messages('dsp.codeCi'),
        //     key: 'codeCi',
        //     dataIndex: 'codeCi',
        //     align: 'left',
        //     width: 120,
        //     render: (value, record) => (
        //         <CopyText
        //             tooltipProps={{ placement: 'right' }}
        //             text={record?.dsp?.codeCi}
        //         >
        //             <p className="truncate text-nowrap">
        //                 {record?.dsp?.codeCi}
        //             </p>
        //         </CopyText>
        //     ),
        // },
        {
            title: messages('dsp.dealType'),
            key: 'mode',
            dataIndex: 'mode',
            align: 'center',
            width: 150,
            ellipsis: true,
            render: (value, record) => {
                const isDirect = record?.mode === DSP_DEAL_TENANT.DIRECT;
                const isSystem =
                    record?.mode === DSP_DEAL_TENANT.SYSTEM_DEFAULT;
                const aggregatorName = record?.aggregator?.name;

                if (isDirect) {
                    return (
                        <Tag
                            color="blue"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <UserCog size={14} />
                            <span>{messages('common.direct')}</span>
                        </Tag>
                    );
                }

                if (isSystem) {
                    return (
                        <Tag
                            color="orange"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <Settings size={14} />
                            <span>{messages('common.system')}</span>
                        </Tag>
                    );
                }

                if (aggregatorName) {
                    return (
                        <Tag className="inline-flex items-center gap-1">
                            <span>{aggregatorName}</span>
                        </Tag>
                    );
                }

                return null;
            },
        },
        // {
        //     title: messages('status.active'),
        //     key: 'isActive',
        //     dataIndex: 'isActive',
        //     align: 'center',
        //     width: 80,
        //     render: (value, record) => <Switch value={true} disabled={true} />,
        // },
        // {
        //     title: messages('roles.isDefault'),
        //     key: 'isDefault',
        //     dataIndex: 'isDefault',
        //     align: 'center',
        //     width: 80,
        //     render: (value, record) => (
        //         <Switch value={record?.isDefault} disabled={true} />
        //     ),
        // },

        {
            title: '',
            key: 'action',
            dataIndex: '',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal(TYPE_MODAL_DSP_TENANT.UPDATE, record);
                    }}
                >
                    <Edit size={SIZE_ICON} />
                </IconButton>
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
