import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { TYPE_MODAL_DSP } from '../../enums';
import { DspData } from '../../types';

// Table cho DSP

type Props = Omit<AppTableProps<DspData>, 'columns'> & {};

export const DspTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<DspData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: '',
            key: 'picture',
            dataIndex: 'picture',
            align: 'center',
            width: 50,
            render: (value) =>
                value ? (
                    <Image
                        src={value}
                        alt="dsp"
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                ) : null,
        },
        {
            title: 'Tên DSP',
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 300,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: 'Có liên kết nghệ sĩ?',
            key: 'canLinkArtistProfile',
            dataIndex: 'canLinkArtistProfile',
            align: 'center',
            width: 120,
            render: (value) => (
                <span className="truncate text-wrap">
                    {value ? 'Có' : 'Không'}
                </span>
            ),
        },
        {
            title: messages('common.dateCreated'),
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
            title: messages('common.dateUpdated'),
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
