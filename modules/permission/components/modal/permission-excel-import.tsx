'use client';
import type { UploadProps } from 'antd';
import { Button, message, Table, Tooltip, Upload } from 'antd';
import {
    AlertCircle,
    Download,
    Trash,
    Upload as UploadIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    downloadPermissionTemplate,
    parsePermissionExcel,
    PermissionImportRow,
} from '../../constants/template';

const { Dragger } = Upload;

export interface PermissionImportRowWithValidation extends PermissionImportRow {
    isValid: boolean;
    errors: string[];
}

interface Props {
    data: PermissionImportRowWithValidation[];
    setData: (data: PermissionImportRowWithValidation[]) => void;
}

const validateRow = (
    row: PermissionImportRow,
    nameLabel: string,
    codeLabel: string
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!row.name || row.name.toString().trim() === '') {
        errors.push(`${nameLabel} is required`);
    }
    if (!row.code || row.code.toString().trim() === '') {
        errors.push(`${codeLabel} is required`);
    }
    return { isValid: errors.length === 0, errors };
};

export default function PermissionExcelImport({ data, setData }: Props) {
    const messages = useTranslations();

    const handleDownloadTemplate = () => {
        downloadPermissionTemplate();
    };

    const handleRemoveRow = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    };

    const handleClearAll = () => {
        setData([]);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx,.xls',
        showUploadList: false,
        beforeUpload: async (file) => {
            try {
                const parsedData = await parsePermissionExcel(file);
                if (parsedData.length === 0) {
                    message.warning(messages('permission.import.noData'));
                    return Upload.LIST_IGNORE;
                }
                // Add validation to each row
                const nameLabel = messages('permission.name');
                const codeLabel = messages('common.code');
                const validatedData = parsedData.map((row) => {
                    const validation = validateRow(row, nameLabel, codeLabel);
                    return { ...row, ...validation };
                });
                setData(validatedData);

                const invalidCount = validatedData.filter(
                    (row) => !row.isValid
                ).length;
                if (invalidCount > 0) {
                    message.warning(
                        messages('permission.import.invalidRows', {
                            count: invalidCount,
                        })
                    );
                } else {
                    message.success(
                        messages('permission.import.success', {
                            count: parsedData.length,
                        })
                    );
                }
            } catch (error) {
                message.error(messages('permission.import.error'));
            }
            return Upload.LIST_IGNORE;
        },
    };

    const columns = [
        {
            title: messages('permission.name'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (
                text: string,
                record: PermissionImportRowWithValidation
            ) => (
                <span
                    className={
                        !text || text.trim() === '' ? 'text-red-500' : ''
                    }
                >
                    {text || <span className="italic text-gray-400">-</span>}
                </span>
            ),
        },
        {
            title: messages('common.code'),
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
            render: (
                text: string,
                record: PermissionImportRowWithValidation
            ) => (
                <span
                    className={
                        !text || text.trim() === '' ? 'text-red-500' : ''
                    }
                >
                    {text || <span className="italic text-gray-400">-</span>}
                </span>
            ),
        },
        {
            title: messages('common.note'),
            dataIndex: 'note',
            key: 'note',
            ellipsis: true,
        },
        {
            title: '',
            key: 'action',
            width: 80,
            render: (
                _: any,
                record: PermissionImportRowWithValidation,
                index: number
            ) => (
                <div className="flex items-center gap-1">
                    {!record.isValid && (
                        <Tooltip title={record.errors.join(', ')}>
                            <AlertCircle size={14} className="text-red-500" />
                        </Tooltip>
                    )}
                    <Button
                        type="text"
                        danger
                        size="small"
                        icon={<Trash size={14} />}
                        onClick={() => handleRemoveRow(index)}
                    />
                </div>
            ),
        },
    ];

    const invalidCount = data.filter((row) => !row.isValid).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    type="default"
                    icon={<Download size={14} />}
                    onClick={handleDownloadTemplate}
                >
                    {messages('permission.import.downloadTemplate')}
                </Button>
                {data.length > 0 && (
                    <Button type="text" danger onClick={handleClearAll}>
                        {messages('common.clearAll')}
                    </Button>
                )}
            </div>

            {data.length === 0 ? (
                <Dragger {...uploadProps} className="!bg-gray-50">
                    <p className="mx-auto mb-3 grid aspect-square w-14 place-content-center rounded-full bg-gray-200 text-2xl">
                        <UploadIcon />
                    </p>
                    <p className="ant-upload-text">
                        {messages('permission.import.dragAndDrop')}
                    </p>
                    <p className="ant-upload-hint">
                        {messages('permission.import.hint')}
                    </p>
                </Dragger>
            ) : (
                <>
                    {invalidCount > 0 && (
                        <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
                            {messages('permission.import.invalidRows', {
                                count: invalidCount,
                            })}
                        </div>
                    )}
                    <Table
                        dataSource={data.map((item, index) => ({
                            ...item,
                            key: index,
                        }))}
                        columns={columns}
                        pagination={false}
                        size="small"
                        scroll={{ y: 'calc(100vh - 400px)' }}
                        rowClassName={(record) =>
                            !record.isValid ? 'bg-red-50' : ''
                        }
                    />
                </>
            )}
        </div>
    );
}
