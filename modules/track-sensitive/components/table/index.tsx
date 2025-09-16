import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_TRACK_SENSITIVE } from '../../enum';
import { TrackSensitiveData, TrackSensitiveFilter } from '../../types';

type Props = Omit<AppTableProps<TrackSensitiveData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: TrackSensitiveFilter;
};

export const TrackSensitiveTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);

    const column: ColumnType<TrackSensitiveData>[] = [
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
            title: messages('trackSensitive.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 180,
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.icon ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CustomTooltip
                        placement="right"
                        title={messages('common.viewDetail')}
                    >
                        {/* <Link
                            href={getLabelDetailRoute(
                                record?.id,
                                LABEL_DETAIL_TABS.RELEASES
                            )}
                        > */}
                        <p className="truncate hover:text-blue-500 hover:underline">
                            {value}
                        </p>
                        {/* </Link> */}
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        // {
        //     title: messages('common.createdAt'),
        //     key: 'createdAt',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 70,
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'createdAt'
        //     ),
        // },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     align: 'center',
        //     width: 70,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'updatedAt'
        //     ),
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        // },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_TRACK_SENSITIVE.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_TRACK_SENSITIVE.DELETE, record);
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
