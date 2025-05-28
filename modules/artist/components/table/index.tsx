import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { TYPE_MODAL_ARTIST } from '../../enum';
import { ArtistData } from '../../types';

type Props = Omit<AppTableProps<ArtistData>, 'columns'> & {};

export const ArtistsTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<ArtistData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            // title: messages('common.thumbnail'),
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            align: 'center',
            width: 30,
            fixed: 'left',
            render: (value) => (
                <div className="flex items-center justify-center">
                    <Image
                        src={value || '/images/default-image.png'}
                        alt="thumbnail"
                        width={200}
                        height={200}
                        className="h-12 w-12 cursor-pointer rounded-lg object-cover"
                    />
                </div>
            ),
        },
        {
            title: messages('artist.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 110,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },

        {
            title: messages('labels.id'),
            key: 'id',
            dataIndex: 'id',
            align: 'left',
            width: 100,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },

        {
            title: messages('tracks.count'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 40,
            render: (value) => <span className="truncate"> {value} </span>,
        },

        {
            title: messages('common.dateCreated'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 100,
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 20,
            fixed: 'right',
            render: () => (
                <ActionButton
                    showUpdate
                    showDetail
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_ARTIST.UPDATE);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_ARTIST.DELETE);
                    }}
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
};
