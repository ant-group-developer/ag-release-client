import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import PopoverTags from '@/components/ui/tag/popover-tags';
import { convertSecondsToTime } from '@/helpers/common';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { ResultScan } from '../../types';

type Props = AppTableProps<ResultScan> & {};

export default function TableTrackTimeRange({ ...props }: Props) {
    const messages = useTranslations();
    const columns: ColumnType<ResultScan>[] = [
        {
            title: 'Time range',
            dataIndex: 'timeRange',
            key: 'timeRange',
            align: 'center',
            render: (_, record) => {
                return (
                    <span className="group-hover:text-blue-500">
                        {`${convertSecondsToTime(record?.key?.startSecond)} - ${convertSecondsToTime(record?.key?.endSecond)}`}
                    </span>
                );
            },
            width: 120,
        },
        {
            title: messages('track.count'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            align: 'center',
            width: 130,
            render: (_, record) => {
                const matches =
                    record?.content?.music ?? record?.content?.humming ?? [];
                return (
                    <span className="group-hover:text-blue-500">
                        {matches?.length}
                    </span>
                );
            },
        },
        {
            title: messages('track.label'),
            dataIndex: 'track',
            key: 'track',
            ellipsis: true,
            width: 500,
            render: (value, record) => {
                let matches =
                    record?.content?.music ?? record?.content?.humming;
                if (!matches) return <p>{messages('track.noResultMatches')}</p>;

                if (!record?.content?.music && record?.content?.humming) {
                    matches = matches?.map((matches) => ({
                        ...matches,
                        score: Math.round(matches.score * 100),
                    }));
                }
                return (
                    <PopoverTags
                        className="!mr-0 group-hover:text-blue-500"
                        tags={matches?.map(
                            (item) => `${item?.title} (${item?.score})`
                        )}
                        maxVisibleTags={2}
                    />
                );
            },
        },
    ];

    return (
        <AppTable
            {...props}
            columns={columns}
            rowKey={(record, index) =>
                `${record.key.startSecond} ${record.key.endSecond}`
            }
            scroll={{ x: 800, y: '650px' }}
            rowClassName={'group cursor-pointer'}
        />
    );
}
