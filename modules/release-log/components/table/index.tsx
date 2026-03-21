import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';

import AppSearch from '@/components/ui/input/search';
import ReleaseTitleColumn from '@/modules/releases/components/table/title-column';
import ReleaseStatusTag from '@/modules/releases/components/tag/release-status-tag';
import { useTestUploadCi } from '@/modules/releases/hooks/use-test-upload-ci';
import { useTestUploadSpotify } from '@/modules/releases/hooks/use-test-upload-spotify';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';

type Props = Omit<AppProTableProps<ReleasesData>, 'columns'> & {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseLogTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const { isSystemTenant } = useAuth();
    const { hasPermission } = usePermission();
    const { testUploadSpotify } = useTestUploadSpotify();
    const { testUploadCi } = useTestUploadCi();

    const column: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => {
                return (
                    <div data-stop-row-click="true">
                        {getIndex(
                            props?.pagination?.pageSize,
                            props?.pagination?.current,
                            index
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 320,
            render: (value, record) => {
                return (
                    <ReleaseTitleColumn
                        record={record}
                        onChangeFilter={onChangeFilter}
                    />
                );
            },
        },
        {
            title: 'Label',
            key: 'publisher',
            dataIndex: 'publisher',
            align: 'left',
            width: 80,
            ellipsis: true,
            render: (value, record) => (
                <CustomTooltip
                    title={messages('filter.filterByValue', {
                        value: record?.label?.name,
                    })}
                >
                    <span
                        data-stop-row-click="true"
                        onClick={() =>
                            onChangeFilter({
                                labelId: record?.labelId,
                            })
                        }
                        className="cursor-pointer truncate hover:underline"
                    >
                        {record?.label?.name}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('release.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'left',
            width: 100,
            render: (_, record) => {
                return (
                    <Tag className="cursor-pointer truncate">
                        {record?.albumFormat?.name}
                    </Tag>
                );
            },
        },
        {
            title: 'UPC',
            key: 'upc',
            dataIndex: 'UPC',
            align: 'left',
            width: 120,
            render: (value, record) => (
                <Paragraph
                    data-stop-row-click="true"
                    className="!mb-0"
                    copyable={!!record?.upc}
                >
                    {record?.upc}
                </Paragraph>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
            },
        },

        {
            title: messages('release.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'left',
            width: 130,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.releaseDate,
                        DATE_FORMAT.DATE_MINUTE
                    )}{' '}
                </span>
            ),
        },

        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'left',
            width: 130,
            sorter: true,
            defaultSortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record?.updatedAt,
                        DATE_FORMAT.DATE_MINUTE
                    )}{' '}
                </span>
            ),
        },
    ];

    return (
        <AppProTable
            headerTitle={
                <AppSearch
                    placeholder={messages('common.search')}
                    onSearch={(value) => onChangeFilter({ keyword: value })}
                    defaultValue={dataFilter.keyword}
                    allowClear
                    style={{ width: 250 }}
                />
            }
            {...props}
            pagination={false}
            columns={column}
            expandable={{
                columnWidth: 40,
                expandRowByClick: true,
                expandedRowRender: (record) => (
                    <div style={{ padding: '8px 24px', background: '#fafafa' }}>
                        <p className="m-0" style={{ whiteSpace: 'pre-wrap' }}>
                            {record.logs || 'No logs found'}
                        </p>
                    </div>
                ),
                rowExpandable: (record) => true,
            }}
            rowClassName={'group'}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
        />
    );
}
