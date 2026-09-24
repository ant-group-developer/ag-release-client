import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import PopoverTags from '@/components/ui/tag/popover-tags';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_REPORT_CONFIG } from '../../enums';
import { ReportConfigData, ReportConfigDataFilter } from '../../types';

type Props = Omit<AppTableProps<ReportConfigData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ReportConfigDataFilter;
};

const renderList = (items?: string[]) => {
    if (!items?.length) {
        return '-';
    }

    return <PopoverTags tags={items} maxVisibleTags={2} />;
};

export default function ReportConfigTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
    const openModal = useModalStore((state) => state.openModal);
    void dataFilter;

    const columns: ColumnType<ReportConfigData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: isMobile ? undefined : 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            width: 180,
            fixed: isMobile ? undefined : 'left',
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.sourceName'),
            key: 'sourceName',
            dataIndex: 'sourceName',
            width: 220,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.sourceCode'),
            key: 'sourceCode',
            dataIndex: 'sourceCode',
            width: 130,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.reportType'),
            key: 'reportType',
            dataIndex: 'reportType',
            width: 120,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.parserCode'),
            key: 'parserCode',
            dataIndex: 'parserCode',
            width: 150,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.filePatterns'),
            key: 'filePatterns',
            dataIndex: 'filePatterns',
            width: 320,
            render: renderList,
        },
        {
            title: messages('reportConfigs.requiredHeaders'),
            key: 'requiredHeaders',
            dataIndex: 'requiredHeaders',
            width: 340,
            render: renderList,
        },
        // {
        //     title: messages('reportConfigs.delimiter'),
        //     key: 'delimiter',
        //     dataIndex: 'delimiter',
        //     width: 100,
        //     align: 'center',
        // },
        // {
        //     title: messages('reportConfigs.priority'),
        //     key: 'priority',
        //     dataIndex: 'priority',
        //     width: 100,
        //     align: 'center',
        // },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        {
            key: 'actions',
            width: 90,
            align: 'center',
            fixed: isMobile ? undefined : 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_REPORT_CONFIG.UPDATE, record)
                    }
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_REPORT_CONFIG.DELETE, record)
                    }
                />
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
