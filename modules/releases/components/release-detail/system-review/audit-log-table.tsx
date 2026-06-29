'use client';

import { Table } from 'antd';
import { FileText } from 'lucide-react';
import { AuditLog } from './types';

interface AuditLogTableProps {
    auditLogs: AuditLog[];
}

export default function AuditLogTable({ auditLogs }: AuditLogTableProps) {
    const auditColumns = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '20%',
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'actor',
            key: 'actor',
            width: '20%',
            render: (text: string) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: '25%',
        },
        {
            title: 'Chi tiết / Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text: string) => (
                <span className="italic text-gray-500">{text || 'N/A'}</span>
            ),
        },
    ];

    return (
        <div className="mt-6 border-t pt-6">
            <div className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600">
                <FileText size={16} />
                Lịch sử kiểm duyệt hệ thống
            </div>
            <Table
                columns={auditColumns}
                dataSource={auditLogs}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
            />
        </div>
    );
}
