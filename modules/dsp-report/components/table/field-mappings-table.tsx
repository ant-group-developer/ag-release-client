import { SIZE_ICON } from '@/constants/common';
import { Button, Form, Popconfirm, Space, Table, Tooltip, message } from 'antd';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useUpdateFieldMappings } from '../../hooks/use-update-field-mappings';
import { FieldMapping } from '../../types';
import { EditableCell } from './editable-cell';

interface FieldMappingsTableProps {
    parserCode: string;
    fieldMappings: FieldMapping[];
    dspReportId: string;
}

export const FieldMappingsTable = ({
    parserCode,
    fieldMappings,
    dspReportId,
}: FieldMappingsTableProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string>('');
    const [localMappings, setLocalMappings] = useState<FieldMapping[]>([]);
    const { updateFieldMappings, isPending } = useUpdateFieldMappings();

    useEffect(() => {
        if (fieldMappings) {
            setLocalMappings(fieldMappings);
        }
    }, [fieldMappings]);

    const getRowKey = (record: FieldMapping) =>
        `${record.reportColumn}-${record.targetColumn}`;

    const isEditing = (record: FieldMapping) =>
        getRowKey(record) === editingKey;

    const edit = (record: FieldMapping) => {
        form.setFieldsValue({
            reportColumn: record.reportColumn,
            parserColumn: record.parserColumn,
            targetColumn: record.targetColumn,
            transform: record.transform,
        });
        setEditingKey(getRowKey(record));
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (record: FieldMapping) => {
        try {
            const row = (await form.validateFields()) as FieldMapping;
            const newData = [...localMappings];
            const index = newData.findIndex(
                (item) => getRowKey(record) === getRowKey(item)
            );

            if (index > -1) {
                updateFieldMappings({
                    parserCode,
                    dspReportId,
                    payload: {
                        fieldMappings: [
                            {
                                reportColumn: row.reportColumn,
                                parserColumn: record.parserColumn,
                                targetColumn: row.targetColumn,
                                transform: row.transform,
                            },
                        ],
                    },
                    onSuccess: () => {
                        message.success(
                            messages('dspReport.ftpParserConfig.success')
                        );
                        const updatedItem = {
                            ...newData[index],
                            ...row,
                        };
                        newData.splice(index, 1, updatedItem);
                        setLocalMappings(newData);
                        setEditingKey('');
                    },
                    onError: () => {
                        message.error(
                            messages('dspReport.ftpParserConfig.failed')
                        );
                    },
                });
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Report Column',
            dataIndex: 'reportColumn',
            key: 'reportColumn',
            editable: true,
            width: '30%',
        },
        {
            title: 'Target Column',
            dataIndex: 'targetColumn',
            key: 'targetColumn',
            editable: true,
            width: '30%',
        },
        {
            title: 'Transform',
            dataIndex: 'transform',
            key: 'transform',
            editable: true,
            width: '40%',
            render: (text: string, record: FieldMapping) => {
                if (isEditing(record)) return null;
                return (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                        {text}
                    </code>
                );
            },
        },
        {
            title: messages('common.action'),
            dataIndex: 'action',
            width: 120,
            render: (_: any, record: FieldMapping) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Popconfirm
                            title={messages('common.confirmSave')}
                            onConfirm={() => save(record)}
                            okText={messages('common.yes')}
                            cancelText={messages('common.no')}
                        >
                            <Button
                                type="primary"
                                size="small"
                                loading={isPending}
                            >
                                {messages('common.save')}
                            </Button>
                        </Popconfirm>
                        <Button
                            size="small"
                            onClick={cancel}
                            disabled={isPending}
                        >
                            {messages('common.cancel')}
                        </Button>
                    </Space>
                ) : (
                    <Tooltip title={messages('common.edit')}>
                        <Button
                            type="link"
                            size="small"
                            icon={<Pencil size={SIZE_ICON} />}
                            disabled={editingKey !== '' || isPending}
                            onClick={() => edit(record)}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: FieldMapping) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="mt-4 overflow-hidden rounded-lg border">
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    dataSource={localMappings}
                    columns={mergedColumns}
                    rowKey={getRowKey}
                    pagination={{ pageSize: 10 }}
                    size="small"
                    loading={isPending}
                    scroll={{ y: 450, x: 'max-content' }}
                />
            </Form>
        </div>
    );
};
