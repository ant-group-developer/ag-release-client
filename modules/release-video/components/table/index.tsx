import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import { Tag, Tooltip } from 'antd';
import { TYPE_MODAL_RELEASE_VIDEO } from '../../enums';
import { ReleaseVideoData, ReleaseVideoDataFilter } from '../../types';
import { Sparkles } from 'lucide-react';

type Props = Omit<AppTableProps<ReleaseVideoData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ReleaseVideoDataFilter;
};

export const ReleaseVideoTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const columns: ColumnType<ReleaseVideoData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('releaseVideo.fields.videoTitle'),
            key: 'videoTitle',
            dataIndex: 'videoTitle',
            ellipsis: true,
            align: 'left',
            width: 220,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'videoTitle'
            ),
            render: (value, record) => (
                <div className="flex items-center gap-2">
                    <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                        <span className="font-semibold text-gray-800 truncate">{value}</span>
                    </CopyText>
                    {record.containsAiContent && (
                        <Tooltip title={messages('releaseVideo.fields.containsAiContent')}>
                            <Sparkles size={14} className="text-purple-500 animate-pulse" />
                        </Tooltip>
                    )}
                    {record.isExplicit && (
                        <Tag color="red" className="!text-[10px] !px-1 !line-height-1 leading-none font-bold scale-90">
                            E
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: messages('releaseVideo.fields.primaryArtists'),
            key: 'primaryArtists',
            dataIndex: 'primaryArtists',
            width: 180,
            render: (value: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[170px]">
                    {value?.map((artist, idx) => (
                        <Tag key={idx} color="blue" className="m-0 max-w-[80px] truncate">
                            {artist}
                        </Tag>
                    )) || '-'}
                </div>
            ),
        },
        {
            title: messages('releaseVideo.fields.featuredArtists'),
            key: 'featuredArtists',
            dataIndex: 'featuredArtists',
            width: 150,
            render: (value: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {value && value.length > 0 ? (
                        value.map((artist, idx) => (
                            <Tag key={idx} color="purple" className="m-0 max-w-[70px] truncate">
                                {artist}
                            </Tag>
                        ))
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            ),
        },
        {
            title: messages('releaseVideo.fields.genres'),
            key: 'genres',
            dataIndex: 'genres',
            width: 150,
            render: (value: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {value?.map((genre, idx) => (
                        <Tag key={idx} color="default" className="m-0 max-w-[70px] truncate">
                            {genre}
                        </Tag>
                    )) || '-'}
                </div>
            ),
        },
        {
            title: messages('releaseVideo.fields.isrc'),
            key: 'isrc',
            dataIndex: 'isrc',
            align: 'center',
            width: 140,
            ellipsis: true,
            render: (value) => <span className="font-mono text-xs">{value}</span>,
        },
        {
            title: messages('common.language'),
            key: 'language',
            dataIndex: 'language',
            align: 'center',
            width: 110,
            render: (value) => <span className="text-sm">{value}</span>,
        },
        {
            title: messages('releaseVideo.fields.channel'),
            key: 'channel',
            dataIndex: 'channel',
            align: 'left',
            width: 120,
            ellipsis: true,
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 140,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value) => (
                <span className="text-gray-500 text-xs truncate">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_RELEASE_VIDEO.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_RELEASE_VIDEO.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={'group cursor-pointer'}
        />
    );
};
