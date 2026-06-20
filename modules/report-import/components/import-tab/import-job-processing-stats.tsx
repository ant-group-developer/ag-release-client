import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ImportJobStatusResponse } from '../../types/payload';

interface ImportJobProcessingStatsProps {
    rows: ImportJobStatusResponse['rows'];
}

export const ImportJobProcessingStats: React.FC<ImportJobProcessingStatsProps> = ({
    rows,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div
            className="grid grid-cols-2 gap-3 mt-2 p-3"
            style={{
                backgroundColor: token.colorBgLayout,
                borderRadius: token.borderRadius,
            }}
        >
            <div>
                <div
                    className="text-xs"
                    style={{
                        color: token.colorTextDescription,
                    }}
                >
                    {messages('reportConfigs.importResult.totalRecords')}
                </div>
                <div
                    className="text-base font-semibold"
                    style={{
                        color: token.colorText,
                    }}
                >
                    {rows.total.toLocaleString()}
                </div>
            </div>
            <div>
                <div
                    className="text-xs"
                    style={{
                        color: token.colorTextDescription,
                    }}
                >
                    {messages('reportConfigs.importResult.processedSuccess')}
                </div>
                <div
                    className="text-base font-semibold"
                    style={{
                        color: token.colorSuccess,
                    }}
                >
                    {rows.processed.toLocaleString()}
                </div>
            </div>
            <div>
                <div
                    className="text-xs"
                    style={{
                        color: token.colorTextDescription,
                    }}
                >
                    {messages('reportConfigs.importResult.skipped')}
                </div>
                <div
                    className="text-base font-semibold"
                    style={{
                        color: token.colorWarning,
                    }}
                >
                    {rows.skipped.toLocaleString()}
                </div>
            </div>
            <div>
                <div
                    className="text-xs"
                    style={{
                        color: token.colorTextDescription,
                    }}
                >
                    {messages('reportConfigs.importResult.errors')}
                </div>
                <div
                    className="text-base font-semibold"
                    style={{
                        color: token.colorError,
                    }}
                >
                    {rows.errors.toLocaleString()}
                </div>
            </div>
        </div>
    );
};
