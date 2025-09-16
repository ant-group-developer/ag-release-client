import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DSP } from '../../enums';
import { useUpdateDsp } from '../../hooks/use-update-dsp';
import { DspData } from '../../types';

type Props = Omit<AppTableProps<DspData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const DspTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateDsp } = useUpdateDsp();
    const column: ColumnType<DspData>[] = [
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
        // {
        //     title: '',
        //     key: 'picture',
        //     dataIndex: 'picture',
        //     align: 'center',
        //     width: 50,
        //     render: (value) => (
        //         <div className="flex justify-center">
        //             <ImageFallback
        //                 fallbackSrc={FALLBACK_IMAGE}
        //                 src={value ?? ''}
        //                 alt="genre"
        //                 width={48}
        //                 height={48}
        //                 className="aspect-square rounded-lg object-cover"
        //             />
        //         </div>
        //     ),
        // },
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
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={value}
                    >
                        <p className="truncate">{value}</p>
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
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 80,
            render: (value, record) => (
                <Switch
                    value={value}
                    onChange={(e) =>
                        updateDsp({ id: record?.id, payload: { isActive: e } })
                    }
                />
            ),
        },
        {
            title: `${messages('status.active')} ${messages('common.policies').toLowerCase()}`,
            key: 'enablePolicy',
            dataIndex: 'enablePolicy',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <Switch
                    value={value}
                    onChange={(e) =>
                        updateDsp({
                            id: record?.id,
                            payload: { enablePolicy: e },
                        })
                    }
                />
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 200,
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
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_DSP.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_DSP.UPDATE, record)
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
