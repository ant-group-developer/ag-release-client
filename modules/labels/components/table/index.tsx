import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_LABEL } from '../../enum';
import { LabelData } from '../../types';

type Props = Omit<AppTableProps<LabelData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const LabelsTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<LabelData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            key: 'picture',
            dataIndex: 'picture',
            align: 'center',
            width: 30,
            fixed: 'left',
            render: (value, record) => {
                return (
                    <div
                        className="flex cursor-pointer justify-center"
                        onClick={() => {
                            router.push(`/labels/detail/${record.id}/overview`);
                        }}
                    >
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={value ?? ''}
                            alt="genre"
                            width={48}
                            height={48}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                );
            },
        },
        {
            title: messages('labels.name'),
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
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            align: 'left',
            width: 150,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
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
            title: messages('common.dateUpdated'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
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
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDetail
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_LABEL.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_LABEL.DELETE, record);
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
