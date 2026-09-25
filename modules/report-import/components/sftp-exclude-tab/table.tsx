import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { Switch, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import {
    FTP_EXCLUDE_PATTERN_SCOPE,
    TYPE_MODAL_FTP_EXCLUDE_PATTERN,
} from '../../enums';
import { useUpdateFtpExcludePattern } from '../../hooks/use-update';
import {
    FtpExcludePatternData,
    FtpExcludePatternDataFilter,
} from '../../types';

type Props = Omit<AppTableProps<FtpExcludePatternData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: FtpExcludePatternDataFilter;
};

export default function FtpExcludePatternTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
    const openModal = useModalStore((state) => state.openModal);
    const { updateFtpExcludePattern } = useUpdateFtpExcludePattern();
    void dataFilter;

    const columns: ColumnType<FtpExcludePatternData>[] = [
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
            title: messages('reportConfigs.sftpExcludePatterns.pattern'),
            key: 'pattern',
            dataIndex: 'pattern',
            width: 180,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.patternType'),
            key: 'patternType',
            dataIndex: 'patternType',
            width: 100,
            align: 'center',
            render: (value) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.scope'),
            key: 'scope',
            dataIndex: 'scope',
            width: 120,
            align: 'center',
            render: (value: any) => {
                const scopes: string[] = Array.isArray(value)
                    ? value
                    : typeof value === 'string'
                      ? value.split(',').filter(Boolean)
                      : [];

                const getScopeColor = (scopeVal: string) => {
                    const normalized = scopeVal?.trim().toLowerCase();
                    if (normalized === FTP_EXCLUDE_PATTERN_SCOPE.FOLDER)
                        return 'orange';
                    if (normalized === FTP_EXCLUDE_PATTERN_SCOPE.FILE)
                        return 'purple';
                    return 'default';
                };

                return (
                    <div
                        style={{
                            display: 'flex',
                            gap: 4,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {scopes.map((s) => (
                            <Tag key={s} color={getScopeColor(s)}>
                                {s}
                            </Tag>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            width: 100,
            align: 'center',
            render: (value, record) => (
                <Switch
                    checked={value === 1 || (value as any) === true}
                    checkedChildren={messages('status.active')}
                    unCheckedChildren={messages('status.inActive')}
                    onChange={(checked) =>
                        updateFtpExcludePattern({
                            id: record.id,
                            payload: { isActive: checked },
                        })
                    }
                />
            ),
        },
        {
            title: messages('reportConfigs.sftpExcludePatterns.description'),
            key: 'description',
            dataIndex: 'description',
            width: 200,
            ellipsis: true,
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {value}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 150,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     width: 150,
        //     align: 'center',
        //     render: (value) => formattedDate(value),
        // },
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
                        openModal(TYPE_MODAL_FTP_EXCLUDE_PATTERN.UPDATE, record)
                    }
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_FTP_EXCLUDE_PATTERN.DELETE, record)
                    }
                />
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
