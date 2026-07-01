'use client';

import { Alert } from 'antd';
import { ShieldAlert } from 'lucide-react';

interface QualityAlertProps {
    errorsCount: number;
}

export default function QualityAlert({ errorsCount }: QualityAlertProps) {
    if (errorsCount <= 0) return null;

    return (
        <Alert
            message={
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                    <ShieldAlert size={18} />
                    <span>Cảnh báo lỗi chất lượng phát hành</span>
                </div>
            }
            description={
                <span className="text-sm text-amber-700 dark:text-amber-300">
                    Bản phát hành này hiện đang có{' '}
                    <strong>{errorsCount}</strong>{' '}
                    lỗi chất lượng chưa giải quyết. Vui lòng kiểm tra và
                    khắc phục toàn bộ lỗi chất lượng dưới đây trước khi
                    tiến hành duyệt thực thi.
                </span>
            }
            type="warning"
            showIcon={false}
            className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
        />
    );
}
